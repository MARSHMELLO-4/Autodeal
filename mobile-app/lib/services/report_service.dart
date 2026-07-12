import 'package:shree_ganesh_autodeal_admin/models/sales_report.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';

class ReportService {
  ReportService(this._api);

  final ApiClient _api;

  Future<SalesReport> getSalesReport() => _api.getSalesReport();
}
