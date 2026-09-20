import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/colors.dart';
import 'package:shree_ganesh_autodeal_admin/core/theme/app_theme.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

class VehicleCard extends StatelessWidget {
  const VehicleCard({
    required this.vehicle,
    required this.onTap,
    required this.onAiShare,
    super.key,
  });

  final Vehicle vehicle;
  final VoidCallback onTap;
  final VoidCallback onAiShare;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(AppTheme.radiusMd + 2),
      clipBehavior: Clip.antiAlias,
      elevation: 0,
      child: InkWell(
        onTap: onTap,
        child: Ink(
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.hairedge),
            borderRadius: BorderRadius.circular(AppTheme.radiusMd + 2),
          ),
          child: SizedBox(
            height: 158,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // ------------------------------------------------------------------
                // Thumbnail
                // ------------------------------------------------------------------
                SizedBox(
                  width: 116,
                  height: 158,
                  child: _buildThumbnail(),
                ),

                const SizedBox(width: 14),

                // ------------------------------------------------------------------
                // Body
                // ------------------------------------------------------------------
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    vehicle.title,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                      fontSize: 15.5,
                                      fontWeight: FontWeight.w800,
                                      color: AppColors.ink,
                                      letterSpacing: -0.2,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 6),
                                StatusPill(
                                    status: vehicle.status, compact: true),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              [
                                if (vehicle.brand.isNotEmpty) vehicle.brand,
                                if (vehicle.modelName.isNotEmpty)
                                  vehicle.modelName,
                                if (vehicle.category != null)
                                  vehicle.category!.name,
                              ].join(' • '),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 11.5,
                                color: AppColors.moss,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            _miniChip(Icons.calendar_today_rounded,
                                '${vehicle.manufactureYear}'),
                            const SizedBox(width: 6),
                            _miniChip(
                              Icons.speed_rounded,
                              '${vehicle.kilometersDriven} km',
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'PRICE',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: FontWeight.w800,
                                letterSpacing: 1.2,
                                color: AppColors.moss,
                              ),
                            ),
                            Text(
                              currencyFormat.format(vehicle.price),
                              style: TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w900,
                                foreground: Paint()
                                  ..shader =
                                      AppColors.brandGradient.createShader(
                                    const Rect.fromLTWH(0, 0, 180, 40),
                                  ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // ------------------------------------------------------------------
                // Action rail
                // ------------------------------------------------------------------
                Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _actionButton(
                        icon: Icons.auto_awesome_rounded,
                        color: AppColors.maroon700,
                        badge: 'AI',
                        tooltip: 'AI Share',
                        onTap: onAiShare,
                      ),
                      const SizedBox(height: 14),
                      const Icon(
                        Icons.chevron_right_rounded,
                        size: 22,
                        color: AppColors.hairedge,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildThumbnail() {
    const radius = BorderRadius.only(
      topLeft: Radius.circular(AppTheme.radiusMd - 2),
      bottomLeft: Radius.circular(AppTheme.radiusMd - 2),
    );

    if (vehicle.thumbnailUrl == null) {
      return Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xfffbe4e5), Color(0xfffdf3f3)],
          ),
        ),
        child: const Center(
          child: Icon(
            Icons.two_wheeler,
            size: 40,
            color: AppColors.maroon300,
          ),
        ),
      );
    }

    return ClipRRect(
      borderRadius: radius,
      child: Stack(
        fit: StackFit.expand,
        children: [
          Image.network(vehicle.thumbnailUrl!, fit: BoxFit.cover),
          const DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.transparent,
                  Color(0x1a000000),
                  Color(0x33000000),
                ],
              ),
            ),
          ),
          if (vehicle.fuelType.isNotEmpty)
            Positioned(
              left: 6,
              bottom: 6,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.55),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  vehicle.fuelType,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 8.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _miniChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.paper,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: AppColors.hairedge),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 11, color: AppColors.maroon600),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 10.5,
              fontWeight: FontWeight.w700,
              color: AppColors.ink,
            ),
          ),
        ],
      ),
    );
  }

  Widget _actionButton({
    required IconData icon,
    required Color color,
    required String badge,
    required String tooltip,
    required VoidCallback onTap,
  }) {
    return Tooltip(
      message: tooltip,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        child: Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            color: AppColors.maroon50,
            borderRadius: BorderRadius.circular(AppTheme.radiusMd - 2),
            border: Border.all(color: AppColors.maroon100),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 18, color: color),
              Text(
                badge,
                style: const TextStyle(
                  fontSize: 8,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.4,
                  color: AppColors.maroon700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
