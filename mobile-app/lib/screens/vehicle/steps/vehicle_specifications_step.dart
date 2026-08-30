import 'package:flutter/material.dart';

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
        const Text(
          'Specifications',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: 6),

        Text(
          'Tell us more about this vehicle.',
          style: TextStyle(
            color: Colors.grey.shade600,
          ),
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
        ),
      ],
    );
  }
}