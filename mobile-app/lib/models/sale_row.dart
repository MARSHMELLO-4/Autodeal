import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';

class SaleRow {
  SaleRow({
    required this.vehicleTitle,
    required this.salePrice,
    required this.saleDate,
    this.buyerName,
    this.buyerPhone,
  });

  final String vehicleTitle;
  final double salePrice;
  final String saleDate;
  final String? buyerName;
  final String? buyerPhone;

  factory SaleRow.fromJson(Map<String, dynamic> json) {
    return SaleRow(
      vehicleTitle: json['vehicleTitle']?.toString() ?? '',
      salePrice: toDouble(json['salePrice']),
      saleDate: json['saleDate']?.toString() ?? '',
      buyerName: json['buyerName']?.toString(),
      buyerPhone: json['buyerPhone']?.toString(),
    );
  }
}
