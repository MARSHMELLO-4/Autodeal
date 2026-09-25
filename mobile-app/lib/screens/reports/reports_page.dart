import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/constants/colors.dart';
import 'package:shree_ganesh_autodeal_admin/core/theme/app_theme.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/sales_report.dart';
import 'package:shree_ganesh_autodeal_admin/models/sale_row.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_click_report.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

class ReportsPage extends StatefulWidget {
  const ReportsPage({required this.api, super.key});

  final ApiClient api;

  @override
  State<ReportsPage> createState() => _ReportsPageState();
}

class _ReportsPageState extends State<ReportsPage> {
  late Future<SalesReport> reportFuture;
  late Future<VehicleClickReport> clicksFuture;

  @override
  void initState() {
    super.initState();
    reportFuture = widget.api.getSalesReport();
    clicksFuture = widget.api.getClickReport();
  }

  void refresh() {
    setState(() {
      reportFuture = widget.api.getSalesReport();
      clicksFuture = widget.api.getClickReport();
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<SalesReport>(
      future: reportFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                SizedBox(
                  width: 34,
                  height: 34,
                  child: CircularProgressIndicator(strokeWidth: 3),
                ),
                SizedBox(height: 14),
                Text(
                  'Crunching the numbers…',
                  style: TextStyle(color: AppColors.moss, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          );
        }
        if (snapshot.hasError) {
          return Padding(
            padding: const EdgeInsets.all(16),
            child: ErrorPanel(
                message: snapshot.error.toString(), onRetry: refresh),
          );
        }
        final report = snapshot.data!;
        return RefreshIndicator(
          color: AppColors.maroon700,
          onRefresh: () async => refresh(),
          child: ListView(
            physics: const AlwaysScrollableScrollPhysics(
              parent: BouncingScrollPhysics(),
            ),
            padding: const EdgeInsets.all(16),
            children: [
              _buildHeader(context),
              const SizedBox(height: 20),
              // ---- Summary grid ----
              GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.45,
                children: [
                  SalesMetricCard(
                    label: 'Total Revenue',
                    value: currencyFormat.format(report.totalRevenue),
                    icon: Icons.payments_rounded,
                    gradient: AppColors.brandGradient,
                  ),
                  SalesMetricCard(
                    label: 'Vehicles Sold',
                    value: '${report.totalVehiclesSold}',
                    icon: Icons.sell_rounded,
                    gradient: const LinearGradient(
                      colors: [Color(0xff059669), Color(0xff047857)],
                    ),
                  ),
                  SalesMetricCard(
                    label: 'Available',
                    value: '${report.availableVehicles}',
                    icon: Icons.storefront_rounded,
                    gradient: const LinearGradient(
                      colors: [Color(0xffd97706), Color(0xffb45309)],
                    ),
                  ),
                  SalesMetricCard(
                    label: 'Reserved',
                    value: '${report.reservedVehicles}',
                    icon: Icons.bookmark_rounded,
                    gradient: const LinearGradient(
                      colors: [Color(0xff64748b), Color(0xff475569)],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Text(
                    'Recent sales',
                    style: Theme.of(context)
                        .textTheme
                        .titleLarge
                        ?.copyWith(fontSize: 18),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    width: 7,
                    height: 7,
                    decoration: const BoxDecoration(
                      color: AppColors.maroon400,
                      shape: BoxShape.circle,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (report.sales.isEmpty)
                const EmptyPanel(
                  icon: Icons.receipt_long_outlined,
                  title: 'No sales yet',
                  subtitle: 'Sold bikes will appear here with buyer details.',
                ),
              for (final sale in report.sales)
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: _SaleTile(sale: sale),
                ),
              const SizedBox(height: 24),
              FutureBuilder<VehicleClickReport>(
                future: clicksFuture,
                builder: (context, clicksSnapshot) {
                  if (clicksSnapshot.connectionState != ConnectionState.done) {
                    return const Padding(
                      padding: EdgeInsets.symmetric(vertical: 28),
                      child: Center(
                        child: SizedBox(
                          width: 28,
                          height: 28,
                          child: CircularProgressIndicator(strokeWidth: 3),
                        ),
                      ),
                    );
                  }
                  if (clicksSnapshot.hasError) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: ErrorPanel(
                        message: clicksSnapshot.error.toString(),
                        onRetry: refresh,
                      ),
                    );
                  }
                  return _ClickSection(report: clicksSnapshot.data!);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Sales Report',
                style: Theme.of(context)
                    .textTheme
                    .headlineSmall
                    ?.copyWith(fontWeight: FontWeight.w800, letterSpacing: -0.4),
              ),
              const SizedBox(height: 3),
              const Text(
                'Performance at a glance',
                style: TextStyle(color: AppColors.moss, fontSize: 13),
              ),
            ],
          ),
        ),
        // Tooltip(
        //   message: 'Refresh',
        //   child: IconButton.filled(
        //     onPressed: refresh,
        //     style: IconButton.styleFrom(
        //       backgroundColor: AppColors.maroon50,
        //       foregroundColor: AppColors.maroon700,
        //       shape: RoundedRectangleBorder(
        //         borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        //         side: const BorderSide(color: AppColors.maroon100),
        //       ),
        //     ),
        //     icon: const Icon(Icons.refresh_rounded, size: 22),
        //   ),
        // ),
      ],
    );
  }
}

/// Gradient metric card.
class SalesMetricCard extends StatelessWidget {
  const SalesMetricCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.gradient,
    super.key,
  });

  final String label;
  final String value;
  final IconData icon;
  final Gradient gradient;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppTheme.radiusLg),
        gradient: gradient,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.12),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.18),
              borderRadius: BorderRadius.circular(11),
            ),
            child: Icon(icon, size: 18, color: Colors.white),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 17,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.85),
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ClickSection extends StatelessWidget {
  const _ClickSection({required this.report});

  final VehicleClickReport report;

  @override
  Widget build(BuildContext context) {
    final maxClicks = report.regions.isEmpty
        ? 0
        : report.regions
            .map((region) => region.clickCount)
            .reduce((a, b) => a > b ? a : b);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Interest',
              style: Theme.of(context)
                  .textTheme
                  .titleLarge
                  ?.copyWith(fontSize: 18),
            ),
            const SizedBox(width: 8),
            Container(
              width: 7,
              height: 7,
              decoration: const BoxDecoration(
                color: AppColors.maroon400,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.45,
          children: [
            SalesMetricCard(
              label: 'Total Clicks',
              value: '${report.totalClicks}',
              icon: Icons.touch_app_rounded,
              gradient: const LinearGradient(
                colors: [Color(0xff7c3aed), Color(0xff6d28d9)],
              ),
            ),
            SalesMetricCard(
              label: 'Unique Visitors',
              value: '${report.uniqueVisitors}',
              icon: Icons.group_rounded,
              gradient: const LinearGradient(
                colors: [Color(0xff0ea5e9), Color(0xff0369a1)],
              ),
            ),
          ],
        ),
        if (report.regions.isNotEmpty) ...[
          const SizedBox(height: 20),
          Text(
            'Top regions',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w800, fontSize: 15),
          ),
          const SizedBox(height: 10),
          for (final region in report.regions.take(6))
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                  border: Border.all(color: AppColors.hairedge),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            region.region == 'Unknown'
                                ? 'Unknown'
                                : region.region,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 14,
                              color: AppColors.ink,
                            ),
                          ),
                        ),
                        Text(
                          '${region.clickCount} clicks',
                          style: const TextStyle(
                            color: AppColors.maroon700,
                            fontWeight: FontWeight.w900,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                      child: LinearProgressIndicator(
                        value: maxClicks == 0
                            ? 0
                            : region.clickCount / maxClicks,
                        minHeight: 7,
                        backgroundColor: AppColors.maroon50,
                        valueColor: const AlwaysStoppedAnimation(
                          AppColors.maroon400,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${region.uniqueVisitors} unique visitors'
                      '${region.country == 'Unknown' ? '' : ' • ${region.country}'}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: AppColors.moss,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
        if (report.topVehicles.isNotEmpty) ...[
          const SizedBox(height: 20),
          Text(
            'Most viewed vehicles',
            style: Theme.of(context)
                .textTheme
                .titleMedium
                ?.copyWith(fontWeight: FontWeight.w800, fontSize: 15),
          ),
          const SizedBox(height: 10),
          for (final vehicle in report.topVehicles.take(8))
            Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                  border: Border.all(color: AppColors.hairedge),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        vehicle.vehicleTitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          fontSize: 14,
                          color: AppColors.ink,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      '${vehicle.clickCount}',
                      style: const TextStyle(
                        color: AppColors.maroon700,
                        fontWeight: FontWeight.w900,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(width: 4),
                    const Text(
                      'clicks',
                      style: TextStyle(
                        color: AppColors.moss,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
        if (report.regions.isEmpty && report.topVehicles.isEmpty)
          const EmptyPanel(
            icon: Icons.insights_outlined,
            title: 'No click data yet',
            subtitle:
                'Views from the public site will show up here once visitors browse vehicles.',
          ),
      ],
    );
  }
}

class _SaleTile extends StatelessWidget {
  const _SaleTile({required this.sale});

  final SaleRow sale;

  @override
  Widget build(BuildContext context) {
    final buyer = [
      sale.buyerName,
      sale.buyerPhone,
    ].where((item) => item != null && item.isNotEmpty).join(' • ');

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        border: Border.all(color: AppColors.hairedge),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.maroon50,
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(
              Icons.receipt_long_rounded,
              color: AppColors.maroon700,
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  sale.vehicleTitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 14,
                    color: AppColors.ink,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  [sale.saleDate, if (buyer.isNotEmpty) buyer]
                      .join('  •  '),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.moss,
                    fontSize: 11.5,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            currencyFormat.format(sale.salePrice),
            style: const TextStyle(
              color: AppColors.maroon700,
              fontWeight: FontWeight.w900,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}