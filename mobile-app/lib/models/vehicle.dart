import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/category.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_document.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_image.dart';

class Vehicle {
  Vehicle({
    required this.id,
    required this.title,
    required this.brand,
    required this.modelName,
    required this.manufactureYear,
    required this.kilometersDriven,
    required this.fuelType,
    required this.price,
    required this.status,
    this.registrationNumber,
    this.variantName,
    this.registrationYear,
    this.ownerSerial,
    this.color,
    this.description,
    this.category,
    this.thumbnailUrl,
    this.location,
    this.images = const [],
    this.documents = const [],
  });

  final int id;
  final String title;
  final String brand;
  final String modelName;
  final int manufactureYear;
  final int kilometersDriven;
  final String fuelType;
  final double price;
  final String status;
  final String? registrationNumber;
  final String? variantName;
  final int? registrationYear;
  final int? ownerSerial;
  final String? color;
  final String? description;
  final Category? category;
  final String? thumbnailUrl;
  final String? location;
  final List<VehicleImage> images;
  final List<VehicleDocument> documents;

  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      id: toInt(json['id']),
      title: json['title']?.toString() ?? '',
      brand: json['brand']?.toString() ?? '',
      modelName: json['modelName']?.toString() ?? '',
      manufactureYear: toInt(json['manufactureYear']),
      kilometersDriven: toInt(json['kilometersDriven']),
      fuelType: json['fuelType']?.toString() ?? 'PETROL',
      price: toDouble(json['price']),
      status: json['status']?.toString() ?? 'AVAILABLE',
      registrationNumber: json['registrationNumber']?.toString(),
      variantName: json['variantName']?.toString(),
      registrationYear: json['registrationYear'] == null
          ? null
          : toInt(json['registrationYear']),
      ownerSerial:
          json['ownerSerial'] == null ? null : toInt(json['ownerSerial']),
      color: json['color']?.toString(),
      description: json['description']?.toString(),
      category: json['category'] == null
          ? null
          : Category.fromJson(asJsonMap(json['category'])),
      thumbnailUrl: json['thumbnailUrl']?.toString(),
      location: json['location']?.toString(),
      images: asJsonList(json['images'])
          .map((item) => VehicleImage.fromJson(asJsonMap(item)))
          .toList(),
      documents: asJsonList(json['documents'])
          .map((item) => VehicleDocument.fromJson(asJsonMap(item)))
          .toList(),
    );
  }
}
