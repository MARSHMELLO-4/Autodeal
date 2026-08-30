import 'package:flutter/material.dart';

import '../vehicle_form_state.dart';
import '../widgets/vehicle_number_field.dart';
import '../widgets/vehicle_text_field.dart';

class VehiclePricingStep extends StatelessWidget {
  const VehiclePricingStep({
    required this.form,
    super.key,
  });

  final VehicleFormState form;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        const Text(
          'Pricing',
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.bold,
          ),
        ),

        const SizedBox(height: 6),

        Text(
          'Set the selling price and add a description.',
          style: TextStyle(
            color: Colors.grey.shade600,
          ),
        ),

        const SizedBox(height: 24),

        VehicleNumberField(
          controller: form.price,
          label: 'Selling Price',
          required: true,
        ),

        VehicleTextField(
          controller: form.description,
          label: 'Description',
          maxLines: 6,
          hint: 'Describe the vehicle condition, features, etc.',
        ),
      ],
    );
  }
}