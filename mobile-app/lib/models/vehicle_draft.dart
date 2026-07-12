import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';

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
    required this.thumbnailUrl,
    required this.location,
    required this.imageUrl,
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
  final String thumbnailUrl;
  final String location;
  final String imageUrl;

  Map<String, dynamic> toJson() {
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
      'thumbnailUrl': emptyToNull(thumbnailUrl),
      'location': emptyToNull(location),
      'images': imageUrl.trim().isEmpty
          ? []
          : [
              {'imageUrl': imageUrl.trim(), 'altText': title, 'displayOrder': 0}
            ],
    };
  }
}
