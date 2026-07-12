import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/sales_report.dart';
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

  @override
  void initState() {
    super.initState();
    reportFuture = widget.api.getSalesReport();
  }

  void refresh() {
    setState(() => reportFuture = widget.api.getSalesReport());
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<SalesReport>(
      future: reportFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
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
          onRefresh: () async => refresh(),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  MetricCard(
                      label: 'Revenue',
                      value: currencyFormat.format(report.totalRevenue)),
                  MetricCard(
                      label: 'Sold',
                      value: report.totalVehiclesSold.toString()),
                  MetricCard(
                      label: 'Available',
                      value: report.availableVehicles.toString()),
                  MetricCard(
                      label: 'Reserved',
                      value: report.reservedVehicles.toString()),
                ],
              ),
              const SizedBox(height: 20),
              Text('Recent sales',
                  style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              if (report.sales.isEmpty)
                const EmptyPanel(
                    icon: Icons.receipt_long_outlined,
                    title: 'No sales yet',
                    subtitle: 'Sold bikes will appear here.'),
              for (final sale in report.sales)
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.receipt_long_outlined),
                    title: Text(sale.vehicleTitle),
                    subtitle: Text([
                      sale.saleDate,
                      sale.buyerName,
                      sale.buyerPhone
                    ]
                        .where((item) => item != null && item.isNotEmpty)
                        .join(' - ')),
                    trailing: Text(currencyFormat.format(sale.salePrice),
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }
}

class MetricCard extends StatelessWidget {
  const MetricCard({required this.label, required this.value, super.key});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 160,
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label,
                  style: TextStyle(
                      color: Theme.of(context).colorScheme.onSurfaceVariant)),
              const SizedBox(height: 8),
              Text(value,
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }
}
