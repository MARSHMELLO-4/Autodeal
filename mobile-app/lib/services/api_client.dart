import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/api_constants.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/category.dart';
import 'package:shree_ganesh_autodeal_admin/models/sales_report.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_draft.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_image.dart';
import 'package:http_parser/http_parser.dart';

class ApiClient {
  ApiClient(this.baseUrl);

  final String baseUrl;
  final String adminKey = ApiConstants.apiAdminKey;

  Future<List<Category>> getCategories() async {
    try {
      final json = await _get('/api/admin/categories');

      return asJsonList(json)
          .map((item) => Category.fromJson(asJsonMap(item)))
          .toList();
    } catch (e) {
      throw _handleException(e, 'Unable to fetch categories');
    }
  }

  Future<List<Vehicle>> getVehicles({
    String? search,
    String? status,
  }) async {
    try {
      final params = <String, String>{
        'page': '0',
        'size': '100',
      };

      if (search != null && search.trim().isNotEmpty) {
        params['search'] = search.trim();
      }

      if (status != null && status != 'ALL') {
        params['status'] = status;
      }

      final json = await _get(
        '/api/admin/vehicles?${Uri(queryParameters: params).query}',
      );

      final content = json is Map ? json['content'] : json;

      return asJsonList(content)
          .map((item) => Vehicle.fromJson(asJsonMap(item)))
          .toList();
    } catch (e) {
      throw _handleException(e, 'Unable to fetch vehicles');
    }
  }

  Future<Vehicle> getVehicle(int id) async {
    try {
      final json = await _get('/api/admin/vehicles/$id');

      return Vehicle.fromJson(asJsonMap(json));
    } catch (e) {
      throw _handleException(e, 'Unable to fetch vehicle details');
    }
  }


  Future<Category> createCategory(String name) async {
    try {
      final json = await _send(
        'POST',
        '/api/admin/categories',
        {'name': name},
      );

      return Category.fromJson(asJsonMap(json));
    } catch (e) {
      throw _handleException(e, 'Unable to create category');
    }
  }


  Future<Vehicle> saveVehicle(
      VehicleDraft draft, {
        int? id,
      }) async {
    try {
      print("Draft to save: ${draft.toJson()}");

      final json = await _send(
        id == null ? 'POST' : 'PUT',
        id == null
            ? '/api/admin/vehicles'
            : '/api/admin/vehicles/$id',
        draft.toJson(),
      );

      return Vehicle.fromJson(asJsonMap(json));
    } catch (e) {
      print("Error saving vehicle: $e");

      throw _handleException(
        e,
        id == null
            ? 'Unable to create vehicle'
            : 'Unable to update vehicle',
      );
    }
  }

  Future<void> deleteVehicle(int id) async {
    try {
      await _delete('/api/admin/vehicles/$id');
    } catch (e) {
      throw _handleException(e, 'Unable to delete vehicle');
    }
  }



  Future<void> uploadDocument({
    required int vehicleId,
    required String path,
    required String title,
    required String type,
  }) async {
    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse(
          '$baseUrl/api/admin/vehicles/$vehicleId/documents',
        ),
      );

      // IMPORTANT:
      // MultipartRequest needs the API key explicitly.
      request.headers.addAll(_headers);

      request.fields['title'] = title;
      request.fields['type'] = type;

      request.files.add(
        await http.MultipartFile.fromPath(
          'file',
          path,
        ),
      );

      final response = await request.send();

      final body = await response.stream.bytesToString();

      if (response.statusCode < 200 ||
          response.statusCode >= 300) {
        throw ApiException(
          _messageFromBody(
            body,
            'Unable to upload document',
          ),
          statusCode: response.statusCode,
        );
      }
    } catch (e) {
      throw _handleException(
        e,
        'Unable to upload document',
      );
    }
  }


  Future<List<VehicleImage>> uploadVehicleImages({
    required int vehicleId,
    required List<String> paths,
    required int startOrder,
    required String altText,
  }) async {
    try {
      final uploaded = <VehicleImage>[];

      for (var index = 0; index < paths.length; index++) {
        final request = http.MultipartRequest(
          'POST',
          Uri.parse(
            '$baseUrl/api/admin/vehicles/$vehicleId/images',
          ),
        );

        // IMPORTANT:
        // MultipartRequest does NOT use _headers automatically.
        request.headers.addAll(_headers);

        request.fields['startOrder'] =
            (startOrder + index).toString();

        request.fields['altText'] = altText;

        request.files.add(
          await http.MultipartFile.fromPath(
            'files',
            paths[index],
            contentType: MediaType('image', 'jpeg'),
          ),
        );

        final response = await request.send();

        final body =
        await response.stream.bytesToString();

        if (response.statusCode < 200 ||
            response.statusCode >= 300) {
          throw ApiException(
            _messageFromBody(
              body,
              'Unable to upload bike photo',
            ),
            statusCode: response.statusCode,
          );
        }

        uploaded.addAll(
          asJsonList(jsonDecode(body))
              .map(
                (item) =>
                VehicleImage.fromJson(
                  asJsonMap(item),
                ),
          ),
        );
      }

      return uploaded;
    } catch (e) {
      print("Error uploading vehicle images: $e");

      throw _handleException(
        e,
        'Unable to upload bike photo',
      );
    }
  }


  Future<List<VehicleImage>> getVehicleImages(
      int vehicleId,
      ) async {
    try {
      final json = await _get(
        '/api/admin/vehicles/$vehicleId/images',
      );

      return asJsonList(json)
          .map(
            (e) => VehicleImage.fromJson(
          asJsonMap(e),
        ),
      )
          .toList();
    } catch (e) {
      throw _handleException(
        e,
        'Unable to fetch vehicle images',
      );
    }
  }


  Future<void> markSold({
    required int vehicleId,
    required double salePrice,
    required String buyerName,
    required String buyerPhone,
    required String notes,
  }) async {
    try {
      await _send(
        'POST',
        '/api/admin/vehicles/$vehicleId/sales',
        {
          'salePrice': salePrice,
          'buyerName': buyerName,
          'buyerPhone': buyerPhone,
          'notes': notes,
          'saleDate': DateFormat(
            'yyyy-MM-dd',
          ).format(DateTime.now()),
        },
      );
    } catch (e) {
      throw _handleException(
        e,
        'Unable to mark vehicle as sold',
      );
    }
  }


  Future<SalesReport> getSalesReport() async {
    try {
      final json = await _get(
        '/api/admin/sales/report',
      );

      return SalesReport.fromJson(
        asJsonMap(json),
      );
    } catch (e) {
      throw _handleException(
        e,
        'Unable to fetch sales report',
      );
    }
  }


  Future<dynamic> _get(String path) async {
    try {
      print("Base URL called: $baseUrl");
      final response = await http.get(
        Uri.parse('$baseUrl$path'),
        headers: _headers,
      );

      return _decode(response);
    } on http.ClientException catch (e) {
      throw ApiException(
        'Unable to connect to server: ${e.message}',
      );
    } catch (e) {
      rethrow;
    }
  }


  Future<dynamic> _send(
      String method,
      String path,
      Map<String, dynamic> body,
      ) async {
    try {
      final uri = Uri.parse('$baseUrl$path');

      final response = method == 'POST'
          ? await http.post(
        uri,
        headers: _headers,
        body: jsonEncode(body),
      )
          : await http.put(
        uri,
        headers: _headers,
        body: jsonEncode(body),
      );

      return _decode(response);
    } on http.ClientException catch (e) {
      throw ApiException(
        'Unable to connect to server: ${e.message}',
      );
    } catch (e) {
      rethrow;
    }
  }



  Future<void> _delete(String path) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl$path'),
        headers: _headers,
      );

      if (response.statusCode < 200 ||
          response.statusCode >= 300) {
        throw ApiException(
          _messageFromBody(
            response.body,
            'Request failed',
          ),
          statusCode: response.statusCode,
        );
      }
    } on http.ClientException catch (e) {
      throw ApiException(
        'Unable to connect to server: ${e.message}',
      );
    } catch (e) {
      rethrow;
    }
  }


  dynamic _decode(http.Response response) {
    if (response.statusCode < 200 ||
        response.statusCode >= 300) {
      throw ApiException(
        _messageFromBody(
          response.body,
          'Request failed',
        ),
        statusCode: response.statusCode,
      );
    }

    if (response.body.isEmpty) {
      return null;
    }

    try {
      return jsonDecode(response.body);
    } catch (_) {
      throw ApiException(
        'Invalid response received from server',
        statusCode: response.statusCode,
      );
    }
  }


  String _messageFromBody(
      String body,
      String fallback,
      ) {
    try {
      if (body.isEmpty) {
        return fallback;
      }

      final json = jsonDecode(body);

      if (json is Map) {
        return json['message']?.toString() ??
            json['error']?.toString() ??
            fallback;
      }

      return fallback;
    } catch (_) {
      return fallback;
    }
  }


  Exception _handleException(
      Object error,
      String fallback,
      ) {
    if (error is ApiException) {
      return error;
    }

    if (error is http.ClientException) {
      return ApiException(
        'Unable to connect to server',
      );
    }

    if (error is FormatException) {
      return ApiException(
        'Invalid data received from server',
      );
    }

    return ApiException(
      error.toString().isNotEmpty
          ? error.toString()
          : fallback,
    );
  }


  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'X-ADMIN-KEY': adminKey,
  };
}


// ================================================================
// API EXCEPTION
// ================================================================

class ApiException implements Exception {
  ApiException(
      this.message, {
        this.statusCode,
      });

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}