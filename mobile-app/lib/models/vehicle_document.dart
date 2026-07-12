import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';

class VehicleDocument {
  VehicleDocument(
      {required this.id,
      required this.title,
      required this.type,
      required this.fileUrl});

  final int id;
  final String title;
  final String type;
  final String fileUrl;

  factory VehicleDocument.fromJson(Map<String, dynamic> json) {
    return VehicleDocument(
      id: toInt(json['id']),
      title: json['title']?.toString() ?? '',
      type: json['type']?.toString() ?? 'OTHER',
      fileUrl: json['fileUrl']?.toString() ?? '',
    );
  }
}
