import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/category.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_draft.dart';
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
  final formKey = GlobalKey<FormState>();
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
  late final TextEditingController thumbnailUrl;
  late final TextEditingController location;
  late final TextEditingController imageUrl;
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
    thumbnailUrl = TextEditingController(text: vehicle?.thumbnailUrl ?? '');
    location = TextEditingController(text: vehicle?.location ?? '');
    imageUrl = TextEditingController(
        text: vehicle?.images.isNotEmpty == true
            ? vehicle!.images.first.imageUrl
            : vehicle?.thumbnailUrl ?? '');
    fuelType = vehicle?.fuelType ?? 'PETROL';
    status = vehicle?.status ?? 'AVAILABLE';
    categoryId = vehicle?.category?.id;
    loadCategories();
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
      thumbnailUrl,
      location,
      imageUrl,
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

  Future<void> save() async {
    if (!formKey.currentState!.validate()) return;
    if (categoryId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please create a category first')),
      );
      return;
    }
    setState(() => saving = true);
    try {
      final draft = VehicleDraft(
        title: title.text.trim(),
        registrationNumber: registrationNumber.text.trim(),
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
        thumbnailUrl: thumbnailUrl.text.trim(),
        location: location.text.trim(),
        imageUrl: imageUrl.text.trim(),
      );
      await widget.api.saveVehicle(draft, id: widget.existing?.id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(isEditing ? 'Bike updated' : 'Bike added')),
        );
        if (isEditing) Navigator.pop(context);
        formKey.currentState!.reset();
      }
    } catch (err) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(err.toString())),
        );
      }
    }
    if (mounted) setState(() => saving = false);
  }

  @override
  Widget build(BuildContext context) {
    final content = loading
        ? const Center(child: CircularProgressIndicator())
        : Form(
            key: formKey,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (error != null)
                  ErrorPanel(message: error!, onRetry: loadCategories),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<int>(
                        key: ValueKey(categoryId),
                        initialValue: categoryId,
                        decoration: const InputDecoration(
                            labelText: 'Category',
                            border: OutlineInputBorder()),
                        items: categories
                            .map((category) => DropdownMenuItem(
                                value: category.id, child: Text(category.name)))
                            .toList(),
                        onChanged: (value) =>
                            setState(() => categoryId = value),
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
                ),
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
                textField(thumbnailUrl, 'Thumbnail image URL'),
                textField(imageUrl, 'Gallery image URL'),
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
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(err.toString())),
        );
      }
    }
  }
}
