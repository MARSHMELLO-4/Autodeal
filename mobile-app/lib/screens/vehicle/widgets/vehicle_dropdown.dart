import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/colors.dart';

class VehicleDropdown extends StatelessWidget {
  const VehicleDropdown({
    required this.label,
    required this.value,
    required this.options,
    required this.onChanged,
    super.key,
  });

  final String label;
  final String value;
  final List<String> options;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: DropdownButtonFormField<String>(
        initialValue: value,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(_iconFor(label), size: 20, color: AppColors.maroon600),
        ),
        items: options
            .map(
              (option) => DropdownMenuItem(
                value: option,
                child: Text(option),
              ),
            )
            .toList(),
        onChanged: (value) {
          if (value != null) {
            onChanged(value);
          }
        },
      ),
    );
  }

  IconData _iconFor(String label) {
    if (label.contains('Fuel')) return Icons.local_gas_station_outlined;
    if (label.contains('Status')) return Icons.flag_outlined;
    return Icons.arrow_drop_down_circle_outlined;
  }
}