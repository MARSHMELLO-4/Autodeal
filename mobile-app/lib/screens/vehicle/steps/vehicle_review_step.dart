import 'package:flutter/material.dart';

import 'package:shree_ganesh_autodeal_admin/models/category.dart';

import '../vehicle_form_state.dart';
import '../widgets/vehicle_review_section.dart';

class VehicleReviewStep extends StatelessWidget {
  const VehicleReviewStep({
    required this.form,
    required this.categories,
    required this.onEditBasicInfo,
    required this.onEditSpecifications,
    required this.onEditPricing,
    required this.onEditPhotos,
    super.key,
  });

  final VehicleFormState form;
  final List<Category> categories;

  final VoidCallback onEditBasicInfo;
  final VoidCallback onEditSpecifications;
  final VoidCallback onEditPricing;
  final VoidCallback onEditPhotos;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Review Vehicle',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: 6),

        Text(
          'Review the details before adding the vehicle.',
          style: TextStyle(
            color: Colors.grey.shade600,
          ),
        ),

        const SizedBox(height: 24),

        _vehicleSummary(context),

        const SizedBox(height: 16),

        VehicleReviewSection(
          title: 'Basic Information',
          onEdit: onEditBasicInfo,
          children: [
            _row(
              'Category',
              _categoryName(),
            ),
            _row(
              'Brand',
              form.brand.text,
            ),
            _row(
              'Model',
              form.modelName.text,
            ),
            _row(
              'Variant',
              form.variantName.text,
            ),
            _row(
              'Registration',
              form.registrationNumber.text,
            ),
            _row(
              'Manufacture Year',
              form.manufactureYear.text,
            ),
            _row(
              'Registration Year',
              form.registrationYear.text,
            ),
          ],
        ),

        VehicleReviewSection(
          title: 'Specifications',
          onEdit: onEditSpecifications,
          children: [
            _row(
              'Kilometers',
              form.kilometersDriven.text,
            ),
            _row(
              'Owner Count',
              form.ownerSerial.text,
            ),
            _row(
              'Fuel',
              form.fuelType,
            ),
            _row(
              'Color',
              form.color.text,
            ),
            _row(
              'Location',
              form.location.text,
            ),
            _row(
              'Status',
              form.status,
            ),
          ],
        ),

        VehicleReviewSection(
          title: 'Pricing',
          onEdit: onEditPricing,
          children: [
            _row(
              'Selling Price',
              '₹${form.price.text}',
            ),
            if (form.description.text.trim().isNotEmpty)
              _row(
                'Description',
                form.description.text,
              ),
          ],
        ),

        VehicleReviewSection(
          title: 'Photos',
          onEdit: onEditPhotos,
          children: [
            _row(
              'Photos',
              '${form.totalPhotos} added',
            ),
          ],
        ),
      ],
    );
  }

  Widget _vehicleSummary(BuildContext context) {
    final title = form.title.text.trim().isNotEmpty
        ? form.title.text.trim()
        : '${form.brand.text} ${form.modelName.text}'
        .trim();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Row(
          children: [
            Container(
              width: 58,
              height: 58,
              decoration: BoxDecoration(
                color: Theme.of(context)
                    .colorScheme
                    .primaryContainer,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                Icons.two_wheeler,
                color: Theme.of(context)
                    .colorScheme
                    .onPrimaryContainer,
                size: 30,
              ),
            ),

            const SizedBox(width: 14),

            Expanded(
              child: Column(
                crossAxisAlignment:
                CrossAxisAlignment.start,
                children: [
                  Text(
                    title.isEmpty
                        ? 'Vehicle'
                        : title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 4),

                  Text(
                    [
                      form.manufactureYear.text,
                      form.kilometersDriven.text.isEmpty
                          ? null
                          : '${form.kilometersDriven.text} km',
                      form.fuelType,
                    ]
                        .whereType<String>()
                        .where((e) => e.isNotEmpty)
                        .join(' • '),
                    style: TextStyle(
                      color: Colors.grey.shade600,
                    ),
                  ),

                  const SizedBox(height: 4),

                  Text(
                    '₹${form.price.text}',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context)
                          .colorScheme
                          .primary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _categoryName() {
    for (final category in categories) {
      if (category.id == form.categoryId) {
        return category.name;
      }
    }

    return '-';
  }

  Widget _row(String label, String value) {
    final displayValue =
    value.trim().isEmpty ? '-' : value.trim();

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment:
        CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 140,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey.shade600,
              ),
            ),
          ),
          Expanded(
            child: Text(
              displayValue,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }
}