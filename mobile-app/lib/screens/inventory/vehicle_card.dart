import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

class VehicleCard extends StatelessWidget {
  const VehicleCard({required this.vehicle, required this.onTap, super.key});

  final Vehicle vehicle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: SizedBox(
                  width: 92,
                  height: 72,
                  child: vehicle.thumbnailUrl == null
                      ? ColoredBox(
                          color: const Color(0xffe4ece7),
                          child: Icon(Icons.two_wheeler,
                              color: Theme.of(context).colorScheme.primary),
                        )
                      : Image.network(vehicle.thumbnailUrl!, fit: BoxFit.cover),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(vehicle.title,
                        style: Theme.of(context).textTheme.titleMedium,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis),
                    Text(
                        '${vehicle.brand} ${vehicle.modelName} - ${vehicle.manufactureYear}'),
                    const SizedBox(height: 6),
                    Text(currencyFormat.format(vehicle.price),
                        style: TextStyle(
                            color: Theme.of(context).colorScheme.secondary,
                            fontWeight: FontWeight.w800)),
                  ],
                ),
              ),
              StatusPill(status: vehicle.status),
            ],
          ),
        ),
      ),
    );
  }
}
