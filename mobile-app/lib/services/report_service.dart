import 'package:shree_ganesh_autodeal_admin/models/sales_report.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_click_report.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';

class ReportService {
  ReportService(this._api);

  final ApiClient _api;

  Future<SalesReport> getSalesReport() => _api.getSalesReport();

  Future<VehicleClickReport> getClickReport({
    DateTime? from,
    DateTime? to,
    int? vehicleId,
  }) {
    return _api.getClickReport(
      from: from,
      to: to,
      vehicleId: vehicleId,
    );
  }
}
