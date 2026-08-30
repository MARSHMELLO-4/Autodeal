import 'package:flutter/material.dart';

import 'package:shree_ganesh_autodeal_admin/models/category.dart';

class VehicleCategoryField extends StatelessWidget {
  const VehicleCategoryField({
    required this.categories,
    required this.value,
    required this.onChanged,
    required this.onCreateCategory,
    super.key,
  });

  final List<Category> categories;
  final int? value;

  final ValueChanged<int?> onChanged;
  final VoidCallback onCreateCategory;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: DropdownButtonFormField<int>(
            initialValue: value,
            decoration: const InputDecoration(
              labelText: 'Vehicle Category',
              border: OutlineInputBorder(),
            ),
            items: categories
                .map(
                  (category) => DropdownMenuItem<int>(
                value: category.id,
                child: Text(category.name),
              ),
            )
                .toList(),
            onChanged: onChanged,
            validator: (value) {
              if (value == null) {
                return 'Required';
              }
              return null;
            },
          ),
        ),
        const SizedBox(width: 10),
        IconButton.filledTonal(
          onPressed: onCreateCategory,
          icon: const Icon(Icons.add),
          tooltip: 'Add category',
        ),
      ],
    );
  }
}