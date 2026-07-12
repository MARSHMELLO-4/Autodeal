import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/category.dart';
import 'package:shree_ganesh_autodeal_admin/models/sales_report.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_draft.dart';

class ApiClient {
  ApiClient(this.baseUrl);

  final String baseUrl;

  Future<List<Category>> getCategories() async {
    final json = await _get('/api/admin/categories');
    return asJsonList(json)
        .map((item) => Category.fromJson(asJsonMap(item)))
        .toList();
  }

  Future<Category> createCategory(String name) async {
    final json = await _send(
      'POST',
      '/api/admin/categories',
      {'name': name},
    );
    return Category.fromJson(asJsonMap(json));
  }

  Future<List<Vehicle>> getVehicles({String? search, String? status}) async {
    final params = <String, String>{'page': '0', 'size': '100'};
    if (search != null && search.trim().isNotEmpty) {
      params['search'] = search.trim();
    }
    if (status != null && status != 'ALL') params['status'] = status;
    final json =
        await _get('/api/admin/vehicles?${Uri(queryParameters: params).query}');
    final content = json is Map ? json['content'] : json;
    return asJsonList(content)
        .map((item) => Vehicle.fromJson(asJsonMap(item)))
        .toList();
  }

  Future<Vehicle> getVehicle(int id) async {
    final json = await _get('/api/admin/vehicles/$id');
    return Vehicle.fromJson(asJsonMap(json));
  }

  Future<Vehicle> saveVehicle(VehicleDraft draft, {int? id}) async {
    final json = await _send(
      id == null ? 'POST' : 'PUT',
      id == null ? '/api/admin/vehicles' : '/api/admin/vehicles/$id',
      draft.toJson(),
    );
    return Vehicle.fromJson(asJsonMap(json));
  }

  Future<void> deleteVehicle(int id) async {
    await _delete('/api/admin/vehicles/$id');
  }

  Future<void> uploadDocument({
    required int vehicleId,
    required String path,
    required String title,
    required String type,
  }) async {
    final request = http.MultipartRequest(
      'POST',
      Uri.parse('$baseUrl/api/admin/vehicles/$vehicleId/documents'),
    );
    request.fields['title'] = title;
    request.fields['type'] = type;
    request.files.add(await http.MultipartFile.fromPath('file', path));
    final response = await request.send();
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final body = await response.stream.bytesToString();
      throw Exception(_messageFromBody(body, 'Unable to upload document'));
    }
  }

  Future<void> markSold({
    required int vehicleId,
    required double salePrice,
    required String buyerName,
    required String buyerPhone,
    required String notes,
  }) async {
    await _send('POST', '/api/admin/vehicles/$vehicleId/sales', {
      'salePrice': salePrice,
      'buyerName': buyerName,
      'buyerPhone': buyerPhone,
      'notes': notes,
      'saleDate': DateFormat('yyyy-MM-dd').format(DateTime.now()),
    });
  }

  Future<SalesReport> getSalesReport() async {
    final json = await _get('/api/admin/sales/report');
    return SalesReport.fromJson(asJsonMap(json));
  }

  Future<dynamic> _get(String path) async {
    final response = await http.get(Uri.parse('$baseUrl$path'));
    return _decode(response);
  }

  Future<dynamic> _send(
      String method, String path, Map<String, dynamic> body) async {
    final uri = Uri.parse('$baseUrl$path');
    final response = method == 'POST'
        ? await http.post(uri, headers: _headers, body: jsonEncode(body))
        : await http.put(uri, headers: _headers, body: jsonEncode(body));
    return _decode(response);
  }

  Future<void> _delete(String path) async {
    final response = await http.delete(Uri.parse('$baseUrl$path'));
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_messageFromBody(response.body, 'Request failed'));
    }
  }

  dynamic _decode(http.Response response) {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_messageFromBody(response.body, 'Request failed'));
    }
    if (response.body.isEmpty) return null;
    return jsonDecode(response.body);
  }

  String _messageFromBody(String body, String fallback) {
    try {
      final json = jsonDecode(body);
      return json is Map ? json['message']?.toString() ?? fallback : fallback;
    } catch (_) {
      return fallback;
    }
  }

  Map<String, String> get _headers => {'Content-Type': 'application/json'};
}
