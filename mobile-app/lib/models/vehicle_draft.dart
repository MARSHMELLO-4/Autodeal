import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_image.dart';

class VehicleDraft {
  VehicleDraft({
    required this.title,
    required this.registrationNumber,
    required this.brand,
    required this.modelName,
    required this.variantName,
    required this.manufactureYear,
    required this.registrationYear,
    required this.kilometersDriven,
    required this.fuelType,
    required this.ownerSerial,
    required this.color,
    required this.price,
    required this.description,
    required this.status,
    required this.categoryId,
    required this.location,
    this.existingImages = const [],
  });

  final String title;
  final String registrationNumber;
  final String brand;
  final String modelName;
  final String variantName;
  final int manufactureYear;
  final int? registrationYear;
  final int kilometersDriven;
  final String fuelType;
  final int? ownerSerial;
  final String color;
  final double price;
  final String description;
  final String status;
  final int categoryId;
  final String location;
  final List<VehicleImage> existingImages;

  Map<String, dynamic> toJson() {
    final visibleImages = existingImages
        .where((image) => image.imageUrl.trim().isNotEmpty)
        .toList();
    return {
      'title': title,
      'registrationNumber': emptyToNull(registrationNumber),
      'brand': brand,
      'modelName': modelName,
      'variantName': emptyToNull(variantName),
      'manufactureYear': manufactureYear,
      'registrationYear': registrationYear,
      'kilometersDriven': kilometersDriven,
      'fuelType': fuelType,
      'ownerSerial': ownerSerial,
      'color': emptyToNull(color),
      'price': price,
      'description': emptyToNull(description),
      'status': status,
      'categoryId': categoryId,
      'thumbnailUrl':
          visibleImages.isEmpty ? null : visibleImages.first.imageUrl,
      'location': emptyToNull(location),
      'images': [
        for (final entry in visibleImages.asMap().entries)
          {
            'imageUrl': entry.value.imageUrl.trim(),
            'altText': emptyToNull(entry.value.altText ?? title),
            'displayOrder': entry.key,
          }
      ],
    };
  }
}
