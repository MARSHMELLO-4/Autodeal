import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import 'package:shree_ganesh_autodeal_admin/models/vehicle_image.dart';

class VehicleFormState {
  final title = TextEditingController();
  final registrationNumber = TextEditingController();
  final brand = TextEditingController();
  final modelName = TextEditingController();
  final variantName = TextEditingController();
  final manufactureYear = TextEditingController();
  final registrationYear = TextEditingController();
  final kilometersDriven = TextEditingController();
  final ownerSerial = TextEditingController();
  final color = TextEditingController();
  final price = TextEditingController();
  final description = TextEditingController();
  final location = TextEditingController();

  int? categoryId;

  String fuelType = 'PETROL';
  String status = 'AVAILABLE';

  final List<XFile> pendingPhotos = [];

  List<VehicleImage> existingPhotos = [];

  int get totalPhotos =>
      existingPhotos.length + pendingPhotos.length;

  void dispose() {
    title.dispose();
    registrationNumber.dispose();
    brand.dispose();
    modelName.dispose();
    variantName.dispose();
    manufactureYear.dispose();
    registrationYear.dispose();
    kilometersDriven.dispose();
    ownerSerial.dispose();
    color.dispose();
    price.dispose();
    description.dispose();
    location.dispose();
  }
}