import 'package:shree_ganesh_autodeal_admin/models/category.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';

class CategoryService {
  CategoryService(this._api);

  final ApiClient _api;

  Future<List<Category>> getCategories() => _api.getCategories();

  Future<Category> createCategory(String name) => _api.createCategory(name);
}
