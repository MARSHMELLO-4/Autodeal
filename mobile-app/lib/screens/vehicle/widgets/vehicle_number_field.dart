import 'package:flutter/material.dart';

class VehicleNumberField extends StatelessWidget {
  const VehicleNumberField({
    required this.controller,
    required this.label,
    this.required = false,
    super.key,
    this.prefixText = '',
  });

  final TextEditingController controller;
  final String label;
  final bool required;
  final String prefixText;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: TextFormField(
        controller: controller,
        keyboardType: TextInputType.number,
        decoration: InputDecoration(
          labelText: label,
          border: const OutlineInputBorder(),
          prefixText: prefixText,
        ),
        validator: (value) {
          if (required &&
              (value == null || value.trim().isEmpty)) {
            return 'Required';
          }

          if (value != null && value.trim().isNotEmpty) {
            if (num.tryParse(value.trim()) == null) {
              return 'Invalid number';
            }
          }

          return null;
        },
      ),
    );
  }
}