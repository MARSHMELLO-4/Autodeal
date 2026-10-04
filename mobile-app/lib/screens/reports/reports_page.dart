import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
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

enum _ReportPeriod { month, year, all, customMonth, customYear }

class _DateRange {
  const _DateRange({this.from, this.to});

  final DateTime? from;
  final DateTime? to;
}

class _ReportsPageState extends State<ReportsPage> {
  late Future<SalesReport> reportFuture;
  late Future<VehicleClickReport> clicksFuture;
  final TextEditingController _dealSearchController = TextEditingController();
  _ReportPeriod _period = _ReportPeriod.month;
  int _visibleSalesCount = 10;
  int _selectedMonth = DateTime.now().month;
  int _selectedYear = DateTime.now().year;

  @override
  void initState() {
    super.initState();
    reportFuture = _loadSalesReport();
    clicksFuture = widget.api.getClickReport();
  }

  @override
  void dispose() {
    _dealSearchController.dispose();
    super.dispose();
  }

  void refresh() {
    setState(() {
      reportFuture = _loadSalesReport();
      clicksFuture = widget.api.getClickReport();
    });
  }

  Future<SalesReport> _loadSalesReport() {
    final range = _selectedRange;
    return widget.api.getSalesReport(from: range.from, to: range.to);
  }

  _DateRange get _selectedRange {
    final now = DateTime.now();
    switch (_period) {
      case _ReportPeriod.month:
        return _DateRange(
          from: DateTime(now.year, now.month),
          to: DateTime(now.year, now.month + 1, 0),
        );
      case _ReportPeriod.year:
        return _DateRange(
          from: DateTime(now.year),
          to: DateTime(now.year, 12, 31),
        );
      case _ReportPeriod.customMonth:
        final year = _selectedYear;
        final month = _selectedMonth;
        return _DateRange(
          from: DateTime(year, month),
          to: DateTime(year, month + 1, 0),
        );
      case _ReportPeriod.customYear:
        final year = _selectedYear;
        return _DateRange(
          from: DateTime(year),
          to: DateTime(year, 12, 31),
        );
      case _ReportPeriod.all:
        return const _DateRange();
    }
  }

  String get _periodLabel {
    final now = DateTime.now();
    switch (_period) {
      case _ReportPeriod.month:
        return DateFormat('MMMM yyyy').format(now);
      case _ReportPeriod.year:
        return '${now.year}';
      case _ReportPeriod.customMonth:
        return DateFormat('MMMM yyyy').format(DateTime(_selectedYear, _selectedMonth));
      case _ReportPeriod.customYear:
        return '$_selectedYear';
      case _ReportPeriod.all:
        return 'All time';
    }
  }

  void _setPeriod(_ReportPeriod period) {
    if (_period == period) return;
    setState(() {
      _period = period;
      _visibleSalesCount = 10;
      reportFuture = _loadSalesReport();
    });
  }

  Future<void> _selectMonth(BuildContext context) async {
    final currentYear = _selectedYear;
    final currentMonth = _selectedMonth;
    
    final month = await showModalBottomSheet<int>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Text(
                    'Select Month',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: 12,
                itemBuilder: (context, index) {
                  final monthNum = index + 1;
                  final monthName = DateFormat('MMMM').format(DateTime(2024, monthNum));
                  final isSelected = monthNum == currentMonth && currentYear == _selectedYear;
                  return ListTile(
                    title: Text(monthName),
                    trailing: isSelected ? const Icon(Icons.check, color: AppColors.maroon700) : null,
                    onTap: () => Navigator.pop(context, monthNum),
                  );
                },
              ),
            ),
          ],
        );
      },
    );

    if (month != null) {
      setState(() {
        _selectedMonth = month;
        _period = _ReportPeriod.customMonth;
        _visibleSalesCount = 10;
        reportFuture = _loadSalesReport();
      });
    }
  }

  Future<void> _selectYear(BuildContext context) async {
    final currentYear = DateTime.now().year;
    final startYear = 2020;
    final years = List.generate(currentYear - startYear + 5, (i) => startYear + i);
    
    final year = await showModalBottomSheet<int>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) {
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Text(
                    'Select Year',
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                  const Spacer(),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            Expanded(
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: years.length,
                itemBuilder: (context, index) {
                  final yr = years[index];
                  final isSelected = yr == _selectedYear;
                  return ListTile(
                    title: Text(yr.toString()),
                    trailing: isSelected ? const Icon(Icons.check, color: AppColors.maroon700) : null,
                    onTap: () => Navigator.pop(context, yr),
                  );
                },
              ),
            ),
          ],
        );
      },
    );

    if (year != null) {
      setState(() {
        _selectedYear = year;
        _period = _ReportPeriod.customYear;
        _visibleSalesCount = 10;
        reportFuture = _loadSalesReport();
      });
    }
  }

  List<SaleRow> _filterSales(List<SaleRow> sales) {
    final query = _dealSearchController.text.trim().toLowerCase();
    if (query.isEmpty) return sales;

    return sales.where((sale) {
      final fields = [
        sale.vehicleTitle,
        sale.buyerName ?? '',
        sale.buyerPhone ?? '',
        sale.saleDate,
        sale.salePrice.toStringAsFixed(0),
      ].join(' ').toLowerCase();
      return fields.contains(query);
    }).toList();
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
        final filteredSales = _filterSales(report.sales);
        final visibleSales = filteredSales.take(_visibleSalesCount).toList();
        final hasMoreSales = filteredSales.length > visibleSales.length;

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
              _buildDealSearch(context),
              const SizedBox(height: 16),
              Row(
                children: [
                  Text(
                    'Sold deals',
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
                  const Spacer(),
                  Text(
                    '${filteredSales.length} found',
                    style: const TextStyle(
                      color: AppColors.moss,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (filteredSales.isEmpty)
                const EmptyPanel(
                  icon: Icons.receipt_long_outlined,
                  title: 'No sold deals found',
                  subtitle: 'Try another search or switch the report period.',
                ),
              for (final sale in visibleSales)
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: _SaleTile(sale: sale),
                ),
              if (hasMoreSales)
                Padding(
                  padding: const EdgeInsets.only(top: 2),
                  child: OutlinedButton.icon(
                    onPressed: () {
                      setState(() => _visibleSalesCount += 10);
                    },
                    icon: const Icon(Icons.expand_more_rounded),
                    label: Text(
                      'Show 10 more (${filteredSales.length - visibleSales.length} left)',
                    ),
                  ),
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
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Sales Report',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.4,
                        ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    'Showing $_periodLabel',
                    style: const TextStyle(color: AppColors.moss, fontSize: 13),
                  ),
                ],
              ),
            ),
            Tooltip(
              message: 'Refresh',
              child: IconButton.filled(
                onPressed: refresh,
                style: IconButton.styleFrom(
                  backgroundColor: AppColors.maroon50,
                  foregroundColor: AppColors.maroon700,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                    side: const BorderSide(color: AppColors.maroon100),
                  ),
                ),
                icon: const Icon(Icons.refresh_rounded, size: 22),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _PeriodFilterChip(
              label: 'Monthly',
              icon: Icons.calendar_month_rounded,
              selected: _period == _ReportPeriod.month,
              onSelected: () => _setPeriod(_ReportPeriod.month),
            ),
            _PeriodFilterChip(
              label: 'Yearly',
              icon: Icons.date_range_rounded,
              selected: _period == _ReportPeriod.year,
              onSelected: () => _setPeriod(_ReportPeriod.year),
            ),
            _PeriodFilterChip(
              label: 'Select Month',
              icon: Icons.calendar_view_month_rounded,
              selected: _period == _ReportPeriod.customMonth,
              onSelected: () => _selectMonth(context),
            ),
            _PeriodFilterChip(
              label: 'Select Year',
              icon: Icons.calendar_today_rounded,
              selected: _period == _ReportPeriod.customYear,
              onSelected: () => _selectYear(context),
            ),
            _PeriodFilterChip(
              label: 'Overall',
              icon: Icons.filter_alt_off_rounded,
              selected: _period == _ReportPeriod.all,
              onSelected: () => _setPeriod(_ReportPeriod.all),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDealSearch(BuildContext context) {
    return TextField(
      controller: _dealSearchController,
      onChanged: (_) {
        setState(() => _visibleSalesCount = 10);
      },
      textInputAction: TextInputAction.search,
      decoration: InputDecoration(
        prefixIcon: const Icon(Icons.search_rounded),
        suffixIcon: _dealSearchController.text.isEmpty
            ? const Icon(Icons.filter_list_rounded)
            : IconButton(
                tooltip: 'Clear search',
                onPressed: () {
                  _dealSearchController.clear();
                  setState(() => _visibleSalesCount = 10);
                },
                icon: const Icon(Icons.close_rounded),
              ),
        labelText: 'Search sold deals',
        hintText: 'Buyer name, contact, bike, price, date',
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: const BorderSide(color: AppColors.hairedge),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: const BorderSide(color: AppColors.hairedge),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          borderSide: const BorderSide(color: AppColors.maroon400, width: 1.4),
        ),
      ),
    );
  }
}

class _PeriodFilterChip extends StatelessWidget {
  const _PeriodFilterChip({
    required this.label,
    required this.icon,
    required this.selected,
    required this.onSelected,
  });

  final String label;
  final IconData icon;
  final bool selected;
  final VoidCallback onSelected;

  @override
  Widget build(BuildContext context) {
    return FilterChip(
      selected: selected,
      onSelected: (_) => onSelected(),
      avatar: Icon(
        icon,
        size: 18,
        color: selected ? Colors.white : AppColors.maroon700,
      ),
      label: Text(label),
      labelStyle: TextStyle(
        color: selected ? Colors.white : AppColors.maroon700,
        fontWeight: FontWeight.w800,
      ),
      selectedColor: AppColors.maroon700,
      backgroundColor: AppColors.maroon50,
      checkmarkColor: Colors.white,
      side: const BorderSide(color: AppColors.maroon100),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
      ),
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
    final buyerName = (sale.buyerName ?? '').trim().isEmpty
        ? 'Buyer not recorded'
        : sale.buyerName!.trim();
    final buyerPhone = (sale.buyerPhone ?? '').trim();

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
                  'Sold to $buyerName',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.ink,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 3),
                Wrap(
                  spacing: 8,
                  runSpacing: 4,
                  children: [
                    _SaleMeta(icon: Icons.calendar_today_rounded, text: sale.saleDate),
                    if (buyerPhone.isNotEmpty)
                      _SaleMeta(icon: Icons.call_rounded, text: buyerPhone),
                  ],
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

class _SaleMeta extends StatelessWidget {
  const _SaleMeta({required this.icon, required this.text});

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 13, color: AppColors.moss),
        const SizedBox(width: 3),
        Text(
          text,
          style: const TextStyle(
            color: AppColors.moss,
            fontSize: 11.5,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}
