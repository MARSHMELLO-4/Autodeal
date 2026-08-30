import 'package:flutter/material.dart';

class VehicleReviewSection extends StatelessWidget {
  const VehicleReviewSection({
    required this.title,
    required this.onEdit,
    required this.children,
    super.key,
  });

  final String title;
  final VoidCallback onEdit;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment:
          CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                TextButton.icon(
                  onPressed: onEdit,
                  icon: const Icon(
                    Icons.edit_outlined,
                    size: 18,
                  ),
                  label: const Text('Edit'),
                ),
              ],
            ),

            const Divider(),

            const SizedBox(height: 4),

            ...children,
          ],
        ),
      ),
    );
  }
}