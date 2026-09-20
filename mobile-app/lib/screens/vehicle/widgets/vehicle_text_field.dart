import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/colors.dart';

class VehicleTextField extends StatelessWidget {
  const VehicleTextField({
    required this.controller,
    required this.label,
    this.required = false,
    this.maxLines = 1,
    this.hint,
    super.key,
    this.capsOnWords = false,
  });

  final TextEditingController controller;
  final String label;
  final bool required;
  final int maxLines;
  final String? hint;
  final bool capsOnWords;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: TextFormField(
        textCapitalization:
            capsOnWords ? TextCapitalization.characters : TextCapitalization.none,
        controller: controller,
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          prefixIcon: Icon(_iconFor(label), size: 20, color: AppColors.maroon600),
        ),
        validator: required
            ? (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Required';
                }
                return null;
              }
            : null,
      ),
    );
  }

  IconData _iconFor(String label) {
    if (label.contains('Brand')) return Icons.badge_outlined;
    if (label.contains('Model')) return Icons.directions_bike_outlined;
    if (label.contains('Variant')) return Icons.tune_rounded;
    if (label.contains('Registration')) return Icons.confirmation_number_outlined;
    if (label.contains('Color')) return Icons.palette_outlined;
    if (label.contains('Location')) return Icons.place_outlined;
    if (label.contains('Description')) return Icons.notes_rounded;
    return Icons.edit_outlined;
  }
}