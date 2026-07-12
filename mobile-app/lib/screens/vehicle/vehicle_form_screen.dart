import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/category.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_draft.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_image.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

class VehicleFormScreen extends StatefulWidget {
  const VehicleFormScreen({required this.api, this.existing, super.key});

  final ApiClient api;
  final Vehicle? existing;

  @override
  State<VehicleFormScreen> createState() => _VehicleFormScreenState();
}

class _VehicleFormScreenState extends State<VehicleFormScreen> {
  static const double _maxPhotoWidth = 1600;
  static const int _photoQuality = 82;

  final formKey = GlobalKey<FormState>();
  final imagePicker = ImagePicker();
  final pendingPhotos = <XFile>[];

  late final TextEditingController title;
  late final TextEditingController registrationNumber;
  late final TextEditingController brand;
  late final TextEditingController modelName;
  late final TextEditingController variantName;
  late final TextEditingController manufactureYear;
  late final TextEditingController registrationYear;
  late final TextEditingController kilometersDriven;
  late final TextEditingController ownerSerial;
  late final TextEditingController color;
  late final TextEditingController price;
  late final TextEditingController description;
  late final TextEditingController location;
  late List<VehicleImage> existingPhotos;

  List<Category> categories = [];
  int? categoryId;
  String fuelType = 'PETROL';
  String status = 'AVAILABLE';
  bool loading = true;
  bool saving = false;
  String? error;

  bool get isEditing => widget.existing != null;

  @override
  void initState() {
    super.initState();
    final vehicle = widget.existing;
    title = TextEditingController(text: vehicle?.title ?? '');
    registrationNumber =
        TextEditingController(text: vehicle?.registrationNumber ?? '');
    brand = TextEditingController(text: vehicle?.brand ?? '');
    modelName = TextEditingController(text: vehicle?.modelName ?? '');
    variantName = TextEditingController(text: vehicle?.variantName ?? '');
    manufactureYear =
        TextEditingController(text: vehicle?.manufactureYear.toString() ?? '');
    registrationYear = TextEditingController(
        text: vehicle?.registrationYear?.toString() ?? '');
    kilometersDriven =
        TextEditingController(text: vehicle?.kilometersDriven.toString() ?? '');
    ownerSerial =
        TextEditingController(text: vehicle?.ownerSerial?.toString() ?? '');
    color = TextEditingController(text: vehicle?.color ?? '');
    price =
        TextEditingController(text: vehicle?.price.toStringAsFixed(0) ?? '');
    description = TextEditingController(text: vehicle?.description ?? '');
    location = TextEditingController(text: vehicle?.location ?? '');
    existingPhotos = [...?vehicle?.images]
      ..sort((a, b) => a.displayOrder.compareTo(b.displayOrder));
    fuelType = vehicle?.fuelType ?? 'PETROL';
    status = vehicle?.status ?? 'AVAILABLE';
    categoryId = vehicle?.category?.id;
    loadCategories();
    restoreLostPhotos();
  }

  @override
  void dispose() {
    for (final controller in [
      title,
      registrationNumber,
      brand,
      modelName,
      variantName,
      manufactureYear,
      registrationYear,
      kilometersDriven,
      ownerSerial,
      color,
      price,
      description,
      location,
    ]) {
      controller.dispose();
    }
    super.dispose();
  }

  Future<void> loadCategories() async {
    try {
      categories = await widget.api.getCategories();
      categoryId ??= categories.isEmpty ? null : categories.first.id;
    } catch (err) {
      error = err.toString();
    }
    if (mounted) setState(() => loading = false);
  }

  Future<void> restoreLostPhotos() async {
    try {
      final response = await imagePicker.retrieveLostData();
      if (!mounted || response.isEmpty) return;
      if (response.exception != null) {
        showMessage('Unable to restore the interrupted photo capture');
        return;
      }
      final files = response.files;
      if (files == null || files.isEmpty) return;
      setState(() => pendingPhotos.addAll(files));
    } catch (_) {
      // Lost image recovery is best-effort only.
    }
  }

  Future<void> takePhoto() async {
    try {
      final photo = await imagePicker.pickImage(
        source: ImageSource.camera,
        maxWidth: _maxPhotoWidth,
        imageQuality: _photoQuality,
      );
      if (photo == null || !mounted) return;
      setState(() => pendingPhotos.add(photo));
    } catch (err) {
      if (mounted) showMessage('Unable to open camera: $err');
    }
  }

  Future<void> pickFromGallery() async {
    try {
      final photos = await imagePicker.pickMultiImage(
        maxWidth: _maxPhotoWidth,
        imageQuality: _photoQuality,
      );
      if (photos.isEmpty || !mounted) return;
      setState(() => pendingPhotos.addAll(photos));
    } catch (err) {
      if (mounted) showMessage('Unable to open gallery: $err');
    }
  }

  Future<void> save() async {
    if (!formKey.currentState!.validate()) return;
    if (categoryId == null) {
      showMessage('Please create a category first');
      return;
    }
    if (existingPhotos.isEmpty && pendingPhotos.isEmpty) {
      showMessage('Please add at least one bike photo');
      return;
    }
    setState(() => saving = true);
    try {
      final draft = VehicleDraft(
        title: title.text.trim(),
        registrationNumber: registrationNumber.text.trim().toUpperCase(),
        brand: brand.text.trim(),
        modelName: modelName.text.trim(),
        variantName: variantName.text.trim(),
        manufactureYear: int.parse(manufactureYear.text),
        registrationYear: nullableInt(registrationYear.text),
        kilometersDriven: int.parse(kilometersDriven.text),
        fuelType: fuelType,
        ownerSerial: nullableInt(ownerSerial.text),
        color: color.text.trim(),
        price: double.parse(price.text),
        description: description.text.trim(),
        status: status,
        categoryId: categoryId!,
        location: location.text.trim(),
        existingImages: existingPhotos,
      );
      final savedVehicle =
          await widget.api.saveVehicle(draft, id: widget.existing?.id);
      if (pendingPhotos.isNotEmpty) {
        print("Pending Photos : ${pendingPhotos.map((photo) => photo.path).toList()}");
        await widget.api.uploadVehicleImages(
          vehicleId: savedVehicle.id,
          paths: pendingPhotos.map((photo) => photo.path).toList(),
          startOrder: existingPhotos.length,
          altText: savedVehicle.title,
        );
      }
      if (!mounted) return;
      showMessage(isEditing ? 'Bike updated' : 'Bike added');
      if (isEditing) {
        Navigator.pop(context);
      } else {
        clearFormAfterCreate();
      }
    } catch (err) {
      if (mounted) showMessage(err.toString());
    }
    if (mounted) setState(() => saving = false);
  }

  void showMessage(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  void clearFormAfterCreate() {
    formKey.currentState!.reset();
    for (final controller in [
      title,
      registrationNumber,
      brand,
      modelName,
      variantName,
      manufactureYear,
      registrationYear,
      kilometersDriven,
      ownerSerial,
      color,
      price,
      description,
      location,
    ]) {
      controller.clear();
    }
    setState(() {
      fuelType = 'PETROL';
      status = 'AVAILABLE';
      pendingPhotos.clear();
      existingPhotos = [];
    });
  }

  @override
  Widget build(BuildContext context) {
    final content = loading
        ? const Center(child: CircularProgressIndicator())
        : Form(
            key: formKey,
            autovalidateMode: AutovalidateMode.onUserInteraction,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (error != null)
                  ErrorPanel(message: error!, onRetry: loadCategories),
                categoryField(),
                const SizedBox(height: 12),
                textField(title, 'Bike title', required: true),
                textField(registrationNumber, 'Registration number'),
                Row(children: [
                  Expanded(child: textField(brand, 'Brand', required: true)),
                  const SizedBox(width: 8),
                  Expanded(
                      child: textField(modelName, 'Model', required: true)),
                ]),
                textField(variantName, 'Variant'),
                Row(children: [
                  Expanded(
                      child: numberField(manufactureYear, 'Manufacture year',
                          required: true)),
                  const SizedBox(width: 8),
                  Expanded(
                      child:
                          numberField(registrationYear, 'Registration year')),
                ]),
                Row(children: [
                  Expanded(
                      child: numberField(kilometersDriven, 'Kilometers',
                          required: true)),
                  const SizedBox(width: 8),
                  Expanded(child: numberField(ownerSerial, 'Owner count')),
                ]),
                Row(children: [
                  Expanded(
                    child: dropdown(
                        'Fuel',
                        fuelType,
                        ['PETROL', 'ELECTRIC', 'HYBRID', 'OTHER'],
                        (value) => setState(() => fuelType = value)),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: dropdown(
                        'Status',
                        status,
                        ['AVAILABLE', 'RESERVED', 'SOLD'],
                        (value) => setState(() => status = value)),
                  ),
                ]),
                textField(color, 'Color'),
                numberField(price, 'Price', required: true),
                textField(location, 'Location'),
                photoPicker(),
                textField(description, 'Description', maxLines: 4),
                const SizedBox(height: 12),
                FilledButton.icon(
                  onPressed: saving ? null : save,
                  icon: saving
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2))
                      : const Icon(Icons.save),
                  label: Text(isEditing ? 'Update bike' : 'Add bike'),
                ),
              ],
            ),
          );

    if (!isEditing) return content;

    return Scaffold(
      appBar: AppBar(title: const Text('Edit bike')),
      body: content,
    );
  }

  Widget categoryField() {
    return Row(
      children: [
        Expanded(
          child: DropdownButtonFormField<int>(
            key: ValueKey(categoryId),
            initialValue: categoryId,
            decoration: const InputDecoration(
                labelText: 'Category', border: OutlineInputBorder()),
            items: categories
                .map((category) => DropdownMenuItem(
                    value: category.id, child: Text(category.name)))
                .toList(),
            onChanged: (value) => setState(() => categoryId = value),
            validator: (value) => value == null ? 'Required' : null,
          ),
        ),
        const SizedBox(width: 8),
        IconButton.filledTonal(
          onPressed: createCategory,
          icon: const Icon(Icons.add),
          tooltip: 'Add category',
        ),
      ],
    );
  }

  Widget photoPicker() {
    final totalPhotos = existingPhotos.length + pendingPhotos.length;
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text('Bike photos',
                    style: Theme.of(context).textTheme.titleMedium),
              ),
              Text('$totalPhotos selected',
                  style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: FilledButton.tonalIcon(
                  onPressed: saving ? null : takePhoto,
                  icon: const Icon(Icons.photo_camera),
                  label: const Text('Camera'),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: saving ? null : pickFromGallery,
                  icon: const Icon(Icons.photo_library_outlined),
                  label: const Text('Gallery'),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (totalPhotos == 0)
            const SizedBox(
              height: 110,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  border: Border.fromBorderSide(
                      BorderSide(color: Color(0xffd5ddd8))),
                  borderRadius: BorderRadius.all(Radius.circular(8)),
                ),
                child: Center(child: Icon(Icons.add_a_photo_outlined)),
              ),
            )
          else
            SizedBox(
              height: 122,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  for (var index = 0; index < existingPhotos.length; index++)
                    photoTile(
                      isThumbnail: index == 0,
                      image: Image.network(
                        existingPhotos[index].imageUrl,
                        fit: BoxFit.cover,
                      ),
                      onRemove: () =>
                          setState(() => existingPhotos.removeAt(index)),
                    ),
                  for (var index = 0; index < pendingPhotos.length; index++)
                    photoTile(
                      isThumbnail: existingPhotos.isEmpty && index == 0,
                      image: Image.file(
                        File(pendingPhotos[index].path),
                        fit: BoxFit.cover,
                      ),
                      onRemove: () =>
                          setState(() => pendingPhotos.removeAt(index)),
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget photoTile({
    required bool isThumbnail,
    required Image image,
    required VoidCallback onRemove,
  }) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: SizedBox(
        width: 118,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(8),
          child: Stack(
            fit: StackFit.expand,
            children: [
              image,
              Positioned(
                top: 6,
                right: 6,
                child: IconButton.filledTonal(
                  onPressed: saving ? null : onRemove,
                  icon: const Icon(Icons.close, size: 18),
                  tooltip: 'Remove photo',
                  style: IconButton.styleFrom(
                    minimumSize: const Size(32, 32),
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                ),
              ),
              if (isThumbnail)
                Positioned(
                  left: 6,
                  bottom: 6,
                  child: DecoratedBox(
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.primary,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      child: Text(
                        'Thumbnail',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget textField(TextEditingController controller, String label,
      {bool required = false, int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextFormField(
        controller: controller,
        maxLines: maxLines,
        decoration: InputDecoration(
            labelText: label, border: const OutlineInputBorder()),
        validator: required
            ? (value) =>
                value == null || value.trim().isEmpty ? 'Required' : null
            : null,
      ),
    );
  }

  Widget numberField(TextEditingController controller, String label,
      {bool required = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextFormField(
        controller: controller,
        keyboardType: TextInputType.number,
        decoration: InputDecoration(
            labelText: label, border: const OutlineInputBorder()),
        validator: (value) {
          if (required && (value == null || value.trim().isEmpty)) {
            return 'Required';
          }
          if (value != null &&
              value.trim().isNotEmpty &&
              num.tryParse(value) == null) {
            return 'Invalid number';
          }
          return null;
        },
      ),
    );
  }

  Widget dropdown(String label, String value, List<String> options,
      ValueChanged<String> onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: DropdownButtonFormField<String>(
        key: ValueKey(value),
        initialValue: value,
        decoration: InputDecoration(
            labelText: label, border: const OutlineInputBorder()),
        items: options
            .map((option) =>
                DropdownMenuItem(value: option, child: Text(option)))
            .toList(),
        onChanged: (value) {
          if (value != null) onChanged(value);
        },
      ),
    );
  }

  Future<void> createCategory() async {
    final controller = TextEditingController();
    final name = await showDialog<String>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add category'),
          content: TextField(
              controller: controller,
              decoration: const InputDecoration(labelText: 'Name')),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Cancel')),
            FilledButton(
                onPressed: () => Navigator.pop(context, controller.text.trim()),
                child: const Text('Create')),
          ],
        );
      },
    );
    controller.dispose();
    if (name == null || name.isEmpty) return;
    try {
      final category = await widget.api.createCategory(name);
      setState(() {
        categories = [...categories, category];
        categoryId = category.id;
      });
    } catch (err) {
      if (mounted) showMessage(err.toString());
    }
  }
}
