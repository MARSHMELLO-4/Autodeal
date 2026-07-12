import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/sale_row.dart';

class SalesReport {
  SalesReport({
    required this.totalRevenue,
    required this.totalVehiclesSold,
    required this.availableVehicles,
    required this.reservedVehicles,
    required this.soldVehicles,
    required this.averageSalePrice,
    required this.sales,
  });

  final double totalRevenue;
  final int totalVehiclesSold;
  final int availableVehicles;
  final int reservedVehicles;
  final int soldVehicles;
  final double averageSalePrice;
  final List<SaleRow> sales;

  factory SalesReport.fromJson(Map<String, dynamic> json) {
    return SalesReport(
      totalRevenue: toDouble(json['totalRevenue']),
      totalVehiclesSold: toInt(json['totalVehiclesSold']),
      availableVehicles: toInt(json['availableVehicles']),
      reservedVehicles: toInt(json['reservedVehicles']),
      soldVehicles: toInt(json['soldVehicles']),
      averageSalePrice: toDouble(json['averageSalePrice']),
      sales: asJsonList(json['sales'])
          .map((item) => SaleRow.fromJson(asJsonMap(item)))
          .toList(),
    );
  }
}
