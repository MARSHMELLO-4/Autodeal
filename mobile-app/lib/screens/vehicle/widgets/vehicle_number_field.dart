import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/colors.dart';

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
          prefixText: prefixText,
          prefixIcon: prefixText.isEmpty
              ? Icon(_iconFor(label), size: 20, color: AppColors.maroon600)
              : null,
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

  IconData _iconFor(String label) {
    if (label.contains('Manufacture')) return Icons.calendar_month_outlined;
    if (label.contains('Registration')) return Icons.event_outlined;
    if (label.contains('Kilometer')) return Icons.speed_rounded;
    if (label.contains('Owner')) return Icons.person_outline_rounded;
    if (label.contains('Price')) return Icons.currency_rupee_rounded;
    return Icons.numbers_rounded;
  }
}