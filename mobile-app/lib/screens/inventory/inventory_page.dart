import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/components/ai_share_flow.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/colors.dart';
import 'package:shree_ganesh_autodeal_admin/core/theme/app_theme.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/screens/inventory/vehicle_card.dart';
import 'package:shree_ganesh_autodeal_admin/screens/inventory/vehicle_details_bottomsheet.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

class InventoryPage extends StatefulWidget {
  const InventoryPage({required this.api, super.key});

  final ApiClient api;

  @override
  State<InventoryPage> createState() => _InventoryPageState();
}

class _InventoryPageState extends State<InventoryPage> {
  final searchController = TextEditingController();
  String status = 'AVAILABLE';
  bool loading = true;
  String? error;
  List<Vehicle> vehicles = [];

  static const _statuses = ['AVAILABLE', 'RESERVED', 'SOLD', 'ALL'];

  @override
  void initState() {
    super.initState();
    load();
  }

  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }

  Future<void> load() async {
    if (!mounted) return;
    setState(() {
      loading = true;
      error = null;
    });
    try {
      vehicles = await widget.api.getVehicles(
        search: searchController.text,
        status: status,
      );
    } catch (err) {
      error = err.toString();
    }
    if (mounted) setState(() => loading = false);
  }

  void _selectStatus(String value) {
    if (status == value) return;
    setState(() => status = value);
    load();
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: load,
      color: AppColors.maroon700,
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(
          parent: BouncingScrollPhysics(),
        ),
        slivers: [
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            sliver: SliverToBoxAdapter(child: _buildHeader(context)),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverToBoxAdapter(child: _buildSearch()),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 6, 16, 16),
            sliver: SliverToBoxAdapter(child: _buildStatusFilter()),
          ),
          ..._buildBody(),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'My Inventory',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.4,
                    ),
              ),
              const SizedBox(height: 3),
              Text(
                loading ? 'Updating live stock…' : '$status matches',
                style: const TextStyle(color: AppColors.moss, fontSize: 13),
              ),
            ],
          ),
        ),
        // Tooltip(
        //   message: 'Refresh',
        //   child: IconButton.filled(
        //     onPressed: loading ? null : load,
        //     style: IconButton.styleFrom(
        //       backgroundColor: AppColors.maroon50,
        //       foregroundColor: AppColors.maroon700,
        //       shape: RoundedRectangleBorder(
        //         borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        //         side: const BorderSide(color: AppColors.maroon100),
        //       ),
        //     ),
        //     icon: loading
        //         ? const SizedBox(
        //             width: 18,
        //             height: 18,
        //             child: CircularProgressIndicator(strokeWidth: 2.2),
        //           )
        //         : const Icon(Icons.refresh_rounded, size: 22),
        //   ),
        // ),
      ],
    );
  }

  Widget _buildSearch() {
    return TextField(
      controller: searchController,
      textInputAction: TextInputAction.search,
      onSubmitted: (_) => load(),
      decoration: InputDecoration(
        hintText: 'Search brand, model, color, number…',
        prefixIcon: const Icon(Icons.search_rounded, size: 22),
        suffixIcon: searchController.text.isNotEmpty
            ? IconButton(
                tooltip: 'Clear',
                onPressed: () {
                  searchController.clear();
                  setState(() {});
                  load();
                },
                icon: const Icon(Icons.close_rounded, size: 20),
              )
            : IconButton(
                tooltip: 'Search',
                onPressed: load,
                icon: const Icon(Icons.arrow_forward_rounded, size: 20),
              ),
      ),
      onChanged: (_) => setState(() {}),
    );
  }

  Widget _buildStatusFilter() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: const Color(0xffefebe4),
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
      ),
      child: Row(
        children: _statuses.map((item) {
          final active = status == item;
          final accent = switch (item) {
            'AVAILABLE' => AppColors.statusAvailable,
            'RESERVED' => AppColors.statusReserved,
            'SOLD' => AppColors.statusSold,
            _ => AppColors.maroon700,
          };
          return Expanded(
            child: AnimatedContainer(
              duration: AppTheme.durationFast,
              curve: Curves.easeOutCubic,
              margin: EdgeInsets.zero,
              height: 44,
              decoration: BoxDecoration(
                color: active ? Colors.white : Colors.transparent,
                borderRadius: BorderRadius.circular(AppTheme.radiusMd - 4),
                boxShadow: active
                    ? const [
                        BoxShadow(
                          color: Color(0x141c1917),
                          blurRadius: 10,
                          offset: Offset(0, 3),
                        ),
                      ]
                    : null,
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () => _selectStatus(item),
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd - 4),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (active) ...[
                        Container(
                          width: 6,
                          height: 6,
                          decoration:
                              BoxDecoration(color: accent, shape: BoxShape.circle),
                        ),
                        const SizedBox(width: 5),
                      ],
                      Text(
                        item == 'ALL' ? 'ALL' : item,
                        style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.3,
                          color: active ? accent : AppColors.moss,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  List<Widget> _buildBody() {
    if (loading) return [_buildSkeleton()];
    if (error != null) {
      return [_padded(ErrorPanel(message: error!, onRetry: load))];
    }
    if (vehicles.isEmpty) {
      return [
        _padded(
          EmptyPanel(
            icon: Icons.storefront_outlined,
            title: status == 'ALL' && searchController.text.isEmpty
                ? 'No vehicles yet'
                : 'No vehicles found',
            subtitle: 'Add a bike or change the search filter to see stock here.',
            action: status == 'AVAILABLE' && searchController.text.isEmpty
                ? null
                : BrandButton(
                    onPressed: () {
                      searchController.clear();
                      status = 'ALL';
                      load();
                    },
                    label: 'Reset filters',
                    icon: Icons.tune_rounded,
                  ),
          ),
        ),
      ];
    }
    return [
      SliverPadding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        sliver: SliverList.separated(
          itemCount: vehicles.length,
          separatorBuilder: (_, __) => const SizedBox(height: 14),
          itemBuilder: (context, index) {
            final vehicle = vehicles[index];
            final car = VehicleCard(
              vehicle: vehicle,
              onTap: () => showVehicleDetails(
                context,
                widget.api,
                vehicle.id,
                load,
              ),
              onAiShare: () => shareAiGeneratedImage(
                context,
                widget.api,
                vehicle,
              ),
            );
            return _StaggerFade(
              index: index,
              child: car,
            );
          },
        ),
      ),
    ];
  }

  Widget _padded(Widget child) =>
      SliverPadding(padding: const EdgeInsets.symmetric(horizontal: 16), sliver: SliverToBoxAdapter(child: child));

  Widget _buildSkeleton() {
    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      sliver: SliverList.separated(
        itemCount: 4,
        separatorBuilder: (_, __) => const SizedBox(height: 14),
        itemBuilder: (_, index) => _SkeletonCard(key: ValueKey(index)),
      ),
    );
  }
}

/// Lightweight staggered entrance so the list doesn't feel abrupt.
class _StaggerFade extends StatelessWidget {
  const _StaggerFade({required this.index, required this.child});

  final int index;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final delay = Duration(milliseconds: (index.clamp(0, 8)) * 55);
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0, end: 1),
      duration: AppTheme.durationBase + delay,
      curve: Curves.easeOutCubic,
      builder: (context, value, widget) {
        return Opacity(
          opacity: value,
          child: Transform.translate(
            offset: Offset(0, (1 - value) * 22),
            child: widget,
          ),
        );
      },
      child: child,
    );
  }
}

class _SkeletonCard extends StatelessWidget {
  const _SkeletonCard({super.key});

  @override
  Widget build(BuildContext context) {
    final base = const Color(0xffece6da);
    final shimmer = AnimatedContainer(
      duration: const Duration(milliseconds: 900),
      decoration: BoxDecoration(
        color: base,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
      ),
    );
    return Container(
      height: 150,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        border: Border.all(color: AppColors.hairedge),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(AppTheme.radiusSm),
            child: SizedBox(width: 128, height: double.infinity, child: shimmer),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  height: 16,
                  width: 150,
                  decoration: BoxDecoration(
                    color: base,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                Container(
                  height: 12,
                  width: 90,
                  decoration: BoxDecoration(
                    color: AppColors.divider,
                    borderRadius: BorderRadius.circular(6),
                  ),
                ),
                Container(
                  height: 20,
                  width: 110,
                  decoration: BoxDecoration(
                    color: base,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}