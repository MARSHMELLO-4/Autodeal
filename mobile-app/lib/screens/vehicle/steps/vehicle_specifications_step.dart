import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

import '../vehicle_form_state.dart';
import '../widgets/vehicle_dropdown.dart';
import '../widgets/vehicle_number_field.dart';
import '../widgets/vehicle_text_field.dart';

class VehicleSpecificationsStep extends StatelessWidget {
  const VehicleSpecificationsStep({
    required this.form,
    required this.onFuelChanged,
    required this.onStatusChanged,
    super.key,
  });

  final VehicleFormState form;

  final ValueChanged<String> onFuelChanged;
  final ValueChanged<String> onStatusChanged;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const FormSectionHeader(
          icon: Icons.build_circle_outlined,
          title: 'Specifications',
          subtitle: 'Tell us more about this vehicle.',
        ),

        const SizedBox(height: 24),

        VehicleNumberField(
          controller: form.kilometersDriven,
          label: 'Kilometers Driven',
          required: true,
        ),

        Row(
          children: [
            Expanded(
              child: VehicleNumberField(
                controller: form.ownerSerial,
                label: 'Owner Count',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: VehicleTextField(
                controller: form.color,
                label: 'Color',
                capsOnWords: true,
              ),
            ),
          ],
        ),

        Row(
          children: [
            Expanded(
              child: VehicleDropdown(
                label: 'Fuel Type',
                value: form.fuelType,
                options: const [
                  'PETROL',
                  'ELECTRIC',
                  'HYBRID',
                  'OTHER',
                ],
                onChanged: onFuelChanged,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: VehicleDropdown(
                label: 'Status',
                value: form.status,
                options: const [
                  'AVAILABLE',
                  'RESERVED',
                  'SOLD',
                ],
                onChanged: onStatusChanged,
              ),
            ),
          ],
        ),

        VehicleTextField(
          controller: form.location,
          label: 'Location',
          capsOnWords: true,
        ),
      ],
    );
  }
}