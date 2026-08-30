import 'package:flutter/material.dart';

import 'package:shree_ganesh_autodeal_admin/models/category.dart';

import '../vehicle_form_state.dart';
import '../widgets/vehicle_category_field.dart';
import '../widgets/vehicle_number_field.dart';
import '../widgets/vehicle_text_field.dart';

class VehicleBasicInfoStep extends StatelessWidget {
  const VehicleBasicInfoStep({
    required this.form,
    required this.categories,
    required this.onCategoryChanged,
    required this.onCreateCategory,
    super.key,
  });

  final VehicleFormState form;
  final List<Category> categories;

  final ValueChanged<int?> onCategoryChanged;
  final VoidCallback onCreateCategory;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildHeader(
          title: 'Vehicle Information',
          subtitle:
          'Enter the basic details of the vehicle.',
        ),

        const SizedBox(height: 24),

        VehicleCategoryField(
          categories: categories,
          value: form.categoryId,
          onChanged: onCategoryChanged,
          onCreateCategory: onCreateCategory,
        ),

        const SizedBox(height: 2),

        Row(
          children: [
            Expanded(
              child: VehicleTextField(
                controller: form.brand,
                label: 'Brand',
                required: true,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: VehicleTextField(
                controller: form.modelName,
                label: 'Model',
                required: true,
              ),
            ),
          ],
        ),

        VehicleTextField(
          controller: form.variantName,
          label: 'Variant',
        ),

        VehicleTextField(
          controller: form.registrationNumber,
          label: 'Registration Number',
        ),

        Row(
          children: [
            Expanded(
              child: VehicleNumberField(
                controller: form.manufactureYear,
                label: 'Manufacture Year',
                required: true,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: VehicleNumberField(
                controller: form.registrationYear,
                label: 'Registration Year',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildHeader({
    required String title,
    required String subtitle,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          subtitle,
          style: TextStyle(
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }
}