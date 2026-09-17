import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';

class AiShareResult {
  AiShareResult({
    required this.vehicleId,
    required this.title,
    this.brand,
    this.imageBase64 = '',
    this.mimeType = 'image/png',
  });

  final int vehicleId;
  final String title;
  final String? brand;
  final String imageBase64;
  final String mimeType;

  factory AiShareResult.fromJson(Map<String, dynamic> json) {
    return AiShareResult(
      vehicleId: toInt(json['vehicleId']),
      title: json['title']?.toString() ?? '',
      brand: json['brand']?.toString(),
      imageBase64: json['imageBase64']?.toString() ?? '',
      mimeType: json['mimeType']?.toString() ?? 'image/png',
    );
  }
}