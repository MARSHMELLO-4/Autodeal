import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

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
        const FormSectionHeader(
          icon: Icons.payments_outlined,
          title: 'Pricing',
          subtitle: 'Set the selling price and add a description.',
        ),

        const SizedBox(height: 24),

        VehicleNumberField(
          controller: form.price,
          label: 'Selling Price',
          required: true,
          prefixText: '₹ ',
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