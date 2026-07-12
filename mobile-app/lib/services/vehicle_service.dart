import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_draft.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';

class VehicleService {
  VehicleService(this._api);

  final ApiClient _api;

  Future<List<Vehicle>> getVehicles({String? search, String? status}) {
    return _api.getVehicles(search: search, status: status);
  }

  Future<Vehicle> getVehicle(int id) => _api.getVehicle(id);

  Future<Vehicle> saveVehicle(VehicleDraft draft, {int? id}) {
    return _api.saveVehicle(draft, id: id);
  }

  Future<void> deleteVehicle(int id) => _api.deleteVehicle(id);
}
