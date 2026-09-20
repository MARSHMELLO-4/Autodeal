import 'package:flutter/material.dart';
import 'package:shree_ganesh_autodeal_admin/widgets/common_widgets.dart';

class VehicleFormNavigation extends StatelessWidget {
  const VehicleFormNavigation({
    required this.currentStep,
    required this.totalSteps,
    required this.onBack,
    required this.onNext,
    required this.onSave,
    this.saving = false,
    super.key,
  });

  final int currentStep;
  final int totalSteps;

  final VoidCallback onBack;
  final VoidCallback onNext;
  final VoidCallback onSave;

  final bool saving;

  @override
  Widget build(BuildContext context) {
    final isFirstStep = currentStep == 0;
    final isLastStep = currentStep == totalSteps - 1;

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xfff2eee6))),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          child: Row(
            children: [
              if (!isFirstStep)
                SizedBox(
                  height: 50,
                  child: OutlinedButton.icon(
                    onPressed: saving ? null : onBack,
                    icon: const Icon(Icons.arrow_back_rounded, size: 18),
                    label: const Text('Back'),
                  ),
                ),
              if (!isFirstStep) const SizedBox(width: 12),
              Expanded(
                child: BrandButton(
                  expanded: true,
                  loading: saving,
                  label: saving
                      ? 'Saving…'
                      : isLastStep
                          ? 'Add Vehicle'
                          : 'Next',
                  icon: saving
                      ? null
                      : isLastStep
                          ? Icons.check_rounded
                          : Icons.arrow_forward_rounded,
                  onPressed: saving ? null : isLastStep ? onSave : onNext,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}