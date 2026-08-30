import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import 'package:shree_ganesh_autodeal_admin/core/utils/formatters.dart';
import 'package:shree_ganesh_autodeal_admin/models/category.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_draft.dart';
import 'package:shree_ganesh_autodeal_admin/models/vehicle_image.dart';
import 'package:shree_ganesh_autodeal_admin/services/api_client.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

import 'vehicle_form_state.dart';

import 'steps/vehicle_basic_info_step.dart';
import 'steps/vehicle_photos_step.dart';
import 'steps/vehicle_pricing_step.dart';
import 'steps/vehicle_review_step.dart';
import 'steps/vehicle_specifications_step.dart';

import 'widgets/vehicle_form_navigation.dart';
import 'widgets/vehicle_step_indicator.dart';

class VehicleFormScreen extends StatefulWidget {
  const VehicleFormScreen({
    required this.api,
    this.existing,
    super.key,
  });

  final ApiClient api;
  final Vehicle? existing;

  @override
  State<VehicleFormScreen> createState() =>
      _VehicleFormScreenState();
}

class _VehicleFormScreenState
    extends State<VehicleFormScreen> {
  static const double _maxPhotoWidth = 1600;
  static const int _photoQuality = 82;

  final formKey = GlobalKey<FormState>();
  final imagePicker = ImagePicker();

  final form = VehicleFormState();

  final List<String> steps = const [
    'Basic Info',
    'Specifications',
    'Pricing',
    'Photos',
    'Review',
  ];

  List<Category> categories = [];

  int currentStep = 0;

  bool loading = true;
  bool saving = false;

  String? error;

  bool get isEditing => widget.existing != null;

  @override
  void initState() {
    super.initState();

    _initializeForm();
    loadCategories();
    restoreLostPhotos();
  }

  void _initializeForm() {
    final vehicle = widget.existing;

    form.title.text = vehicle?.title ?? '';
    form.registrationNumber.text =
        vehicle?.registrationNumber ?? '';

    form.brand.text = vehicle?.brand ?? '';
    form.modelName.text =
        vehicle?.modelName ?? '';

    form.variantName.text =
        vehicle?.variantName ?? '';

    form.manufactureYear.text =
        vehicle?.manufactureYear.toString() ?? '';

    form.registrationYear.text =
        vehicle?.registrationYear?.toString() ?? '';

    form.kilometersDriven.text =
        vehicle?.kilometersDriven.toString() ?? '';

    form.ownerSerial.text =
        vehicle?.ownerSerial?.toString() ?? '';

    form.color.text =
        vehicle?.color ?? '';

    form.price.text =
        vehicle?.price.toStringAsFixed(0) ?? '';

    form.description.text =
        vehicle?.description ?? '';

    form.location.text =
        vehicle?.location ?? '';

    form.existingPhotos = [
      ...?vehicle?.images,
    ]..sort(
          (a, b) => a.displayOrder.compareTo(
        b.displayOrder,
      ),
    );

    form.fuelType =
        vehicle?.fuelType ?? 'PETROL';

    form.status =
        vehicle?.status ?? 'AVAILABLE';

    form.categoryId =
        vehicle?.category?.id;
  }

  @override
  void dispose() {
    form.dispose();
    super.dispose();
  }

  // ------------------------------------------------------------
  // Categories
  // ------------------------------------------------------------

  Future<void> loadCategories() async {
    try {
      final result =
      await widget.api.getCategories();

      categories = result;

      if (form.categoryId == null &&
          categories.isNotEmpty) {
        form.categoryId =
            categories.first.id;
      }
    } catch (err) {
      error = err.toString();
    }

    if (mounted) {
      setState(() {
        loading = false;
      });
    }
  }

  Future<void> createCategory() async {
    final controller =
    TextEditingController();

    final name = await showDialog<String>(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add category'),
          content: TextField(
            controller: controller,
            decoration: const InputDecoration(
              labelText: 'Name',
              border: OutlineInputBorder(),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () =>
                  Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            FilledButton(
              onPressed: () {
                Navigator.pop(
                  context,
                  controller.text.trim(),
                );
              },
              child: const Text('Create'),
            ),
          ],
        );
      },
    );

    controller.dispose();

    if (name == null || name.isEmpty) {
      return;
    }

    try {
      final category =
      await widget.api.createCategory(name);

      if (!mounted) return;

      setState(() {
        categories = [
          ...categories,
          category,
        ];

        form.categoryId =
            category.id;
      });
    } catch (err) {
      if (mounted) {
        showMessage(err.toString());
      }
    }
  }

  // ------------------------------------------------------------
  // Photos
  // ------------------------------------------------------------

  Future<void> restoreLostPhotos() async {
    try {
      final response =
      await imagePicker.retrieveLostData();

      if (!mounted || response.isEmpty) {
        return;
      }

      if (response.exception != null) {
        showMessage(
          'Unable to restore the interrupted photo capture',
        );
        return;
      }

      final files = response.files;

      if (files == null || files.isEmpty) {
        return;
      }

      setState(() {
        form.pendingPhotos.addAll(files);
      });
    } catch (_) {
      // Best effort only.
    }
  }

  Future<void> takePhoto() async {
    try {
      final photo =
      await imagePicker.pickImage(
        source: ImageSource.camera,
        maxWidth: _maxPhotoWidth,
        imageQuality: _photoQuality,
      );

      if (photo == null || !mounted) {
        return;
      }

      setState(() {
        form.pendingPhotos.add(photo);
      });
    } catch (err) {
      if (mounted) {
        showMessage(
          'Unable to open camera: $err',
        );
      }
    }
  }

  Future<void> pickFromGallery() async {
    try {
      final photos =
      await imagePicker.pickMultiImage(
        maxWidth: _maxPhotoWidth,
        imageQuality: _photoQuality,
      );

      if (photos.isEmpty || !mounted) {
        return;
      }

      setState(() {
        form.pendingPhotos.addAll(photos);
      });
    } catch (err) {
      if (mounted) {
        showMessage(
          'Unable to open gallery: $err',
        );
      }
    }
  }

  void removeExistingPhoto(int index) {
    setState(() {
      form.existingPhotos.removeAt(index);
    });
  }

  void removePendingPhoto(int index) {
    setState(() {
      form.pendingPhotos.removeAt(index);
    });
  }

  // ------------------------------------------------------------
  // Navigation
  // ------------------------------------------------------------

  void nextStep() {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setState(() {
        currentStep++;
      });
    }
  }

  void previousStep() {
    if (currentStep == 0) {
      return;
    }

    setState(() {
      currentStep--;
    });
  }

  void goToStep(int step) {
    if (step < 0 ||
        step >= steps.length) {
      return;
    }

    if (step <= currentStep) {
      setState(() {
        currentStep = step;
      });
    }
  }

  // ------------------------------------------------------------
  // Validation
  // ------------------------------------------------------------

  bool validateCurrentStep() {
    switch (currentStep) {
      case 0:
        return validateBasicInfo();

      case 1:
        return validateSpecifications();

      case 2:
        return validatePricing();

      case 3:
        return validatePhotos();

      case 4:
        return true;

      default:
        return false;
    }
  }

  bool validateBasicInfo() {
    if (form.categoryId == null) {
      showMessage(
        'Please select a vehicle category',
      );
      return false;
    }

    if (form.brand.text.trim().isEmpty) {
      showMessage(
        'Please enter the brand',
      );
      return false;
    }

    if (form.modelName.text.trim().isEmpty) {
      showMessage(
        'Please enter the model',
      );
      return false;
    }

    if (form.manufactureYear.text.trim().isEmpty) {
      showMessage(
        'Please enter the manufacture year',
      );
      return false;
    }

    return true;
  }

  bool validateSpecifications() {
    if (form.kilometersDriven.text
        .trim()
        .isEmpty) {
      showMessage(
        'Please enter kilometers driven',
      );
      return false;
    }

    if (num.tryParse(
      form.kilometersDriven.text.trim(),
    ) ==
        null) {
      showMessage(
        'Please enter a valid kilometers value',
      );
      return false;
    }

    return true;
  }

  bool validatePricing() {
    if (form.price.text.trim().isEmpty) {
      showMessage(
        'Please enter the selling price',
      );
      return false;
    }

    if (num.tryParse(
      form.price.text.trim(),
    ) ==
        null) {
      showMessage(
        'Please enter a valid price',
      );
      return false;
    }

    return true;
  }

  bool validatePhotos() {
    if (form.existingPhotos.isEmpty &&
        form.pendingPhotos.isEmpty) {
      showMessage(
        'Please add at least one vehicle photo',
      );
      return false;
    }

    return true;
  }

  // ------------------------------------------------------------
  // Save
  // ------------------------------------------------------------

  Future<void> save() async {
    // Validate all steps first.
    for (var step = 0; step < 4; step++) {
      final valid = switch (step) {
        0 => validateBasicInfo(),
        1 => validateSpecifications(),
        2 => validatePricing(),
        3 => validatePhotos(),
        _ => true,
      };

      if (!valid) {
        setState(() {
          currentStep = step;
        });
        return;
      }
    }

    setState(() {
      saving = true;
    });

    try {
      // ----------------------------------------------------------
      // Generate title automatically
      // ----------------------------------------------------------

      final generatedTitle = [
        form.brand.text.trim(),
        form.modelName.text.trim(),
        form.variantName.text.trim(),
      ].where((value) => value.isNotEmpty).join(' ');

      // ----------------------------------------------------------
      // Create/update vehicle
      // ----------------------------------------------------------

      final draft = VehicleDraft(
        title: generatedTitle,

        registrationNumber:
        form.registrationNumber.text
            .trim()
            .toUpperCase(),

        brand: form.brand.text.trim(),

        modelName:
        form.modelName.text.trim(),

        variantName:
        form.variantName.text.trim(),

        manufactureYear:
        int.parse(form.manufactureYear.text),

        registrationYear:
        nullableInt(form.registrationYear.text),

        kilometersDriven:
        int.parse(form.kilometersDriven.text),

        fuelType:
        form.fuelType,

        ownerSerial:
        nullableInt(form.ownerSerial.text),

        color:
        form.color.text.trim(),

        price:
        double.parse(form.price.text),

        description:
        form.description.text.trim(),

        status:
        form.status,

        categoryId:
        form.categoryId!,

        location:
        form.location.text.trim(),

        // Existing images only.
        existingImages:
        form.existingPhotos,
      );

      final savedVehicle =
      await widget.api.saveVehicle(
        draft,
        id: widget.existing?.id,
      );

      // ----------------------------------------------------------
      // Upload newly selected photos
      // ----------------------------------------------------------

      if (form.pendingPhotos.isNotEmpty) {
        final uploadedImages =
        await widget.api.uploadVehicleImages(
          vehicleId: savedVehicle.id,

          paths: form.pendingPhotos
              .map((photo) => photo.path)
              .toList(),

          startOrder:
          form.existingPhotos.length,

          altText:
          savedVehicle.title,
        );

        debugPrint(
          'Uploaded ${uploadedImages.length} vehicle images',
        );
      }

      // ----------------------------------------------------------
      // Done
      // ----------------------------------------------------------

      if (!mounted) return;

      showMessage(
        isEditing
            ? 'Bike updated'
            : 'Bike added',
      );

      if (isEditing) {
        Navigator.pop(context);
      } else {
        clearFormAfterCreate();
      }
    } catch (err) {
      if (mounted) {
        showMessage(err.toString());
      }

      debugPrint(
        'Error saving vehicle: $err',
      );
    } finally {
      if (mounted) {
        setState(() {
          saving = false;
        });
      }
    }
  }

  void clearFormAfterCreate() {
    form.title.clear();
    form.registrationNumber.clear();
    form.brand.clear();
    form.modelName.clear();
    form.variantName.clear();
    form.manufactureYear.clear();
    form.registrationYear.clear();
    form.kilometersDriven.clear();
    form.ownerSerial.clear();
    form.color.clear();
    form.price.clear();
    form.description.clear();
    form.location.clear();

    setState(() {
      form.fuelType = 'PETROL';
      form.status = 'AVAILABLE';

      form.pendingPhotos.clear();
      form.existingPhotos.clear();

      if (categories.isNotEmpty) {
        form.categoryId =
            categories.first.id;
      } else {
        form.categoryId = null;
      }

      currentStep = 0;
    });
  }

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return Scaffold(
        appBar: AppBar(
          title: Text(
            isEditing
                ? 'Edit bike'
                : 'Add Vehicle',
          ),
        ),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          isEditing
              ? 'Edit bike'
              : 'Add Vehicle',
        ),
      ),
      body: Column(
        children: [
          VehicleStepIndicator(
            currentStep: currentStep,
            steps: steps,
            onStepTap: goToStep,
          ),

          Expanded(
            child: Form(
              key: formKey,
              child: buildCurrentStep(),
            ),
          ),

          VehicleFormNavigation(
            currentStep: currentStep,
            totalSteps: steps.length,
            onBack: previousStep,
            onNext: nextStep,
            onSave: save,
            saving: saving,
          ),
        ],
      ),
    );
  }

  Widget buildCurrentStep() {
    switch (currentStep) {
      case 0:
        return VehicleBasicInfoStep(
          form: form,
          categories: categories,
          onCategoryChanged: (value) {
            setState(() {
              form.categoryId = value;
            });
          },
          onCreateCategory: createCategory,
        );

      case 1:
        return VehicleSpecificationsStep(
          form: form,
          onFuelChanged: (value) {
            setState(() {
              form.fuelType = value;
            });
          },
          onStatusChanged: (value) {
            setState(() {
              form.status = value;
            });
          },
        );

      case 2:
        return VehiclePricingStep(
          form: form,
        );

      case 3:
        return VehiclePhotosStep(
          form: form,
          onCamera: takePhoto,
          onGallery: pickFromGallery,
          onRemoveExisting:
          removeExistingPhoto,
          onRemovePending:
          removePendingPhoto,
          saving: saving,
        );

      case 4:
        return VehicleReviewStep(
          form: form,
          categories: categories,
          onEditBasicInfo: () {
            goToStep(0);
          },
          onEditSpecifications: () {
            goToStep(1);
          },
          onEditPricing: () {
            goToStep(2);
          },
          onEditPhotos: () {
            goToStep(3);
          },
        );

      default:
        return const SizedBox();
    }
  }

  void showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
      ),
    );
  }
}