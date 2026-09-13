import 'package:flutter/material.dart';

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
        textCapitalization: capsOnWords ? TextCapitalization.characters : TextCapitalization.none,
        controller: controller,
        maxLines: maxLines,
        decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          border: const OutlineInputBorder(),
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
}