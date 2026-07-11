package com.autodeal.ShreeGaneshAutodeal.service;

import com.autodeal.ShreeGaneshAutodeal.domain.Category;
import com.autodeal.ShreeGaneshAutodeal.dto.CategoryRequest;
import com.autodeal.ShreeGaneshAutodeal.dto.CategoryResponse;
import com.autodeal.ShreeGaneshAutodeal.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategoryService {

	private final CategoryRepository categoryRepository;

	public CategoryService(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	@Transactional(readOnly = true)
	public List<CategoryResponse> findAll() {
		return categoryRepository.findAll(Sort.by("name")).stream()
				.map(CategoryService::toResponse)
				.toList();
	}

	@Transactional(readOnly = true)
	public Category getEntity(Long id) {
		return categoryRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Category not found: " + id));
	}

	public CategoryResponse create(CategoryRequest request) {
		String slug = normalizeSlug(request.slug() == null || request.slug().isBlank() ? request.name() : request.slug());
		if (categoryRepository.existsByNameIgnoreCase(request.name())) {
			throw new IllegalArgumentException("Category name already exists");
		}
		if (categoryRepository.existsBySlug(slug)) {
			throw new IllegalArgumentException("Category slug already exists");
		}
		Category category = new Category();
		apply(category, request, slug);
		return toResponse(categoryRepository.save(category));
	}

	public CategoryResponse update(Long id, CategoryRequest request) {
		Category category = getEntity(id);
		String slug = normalizeSlug(request.slug() == null || request.slug().isBlank() ? request.name() : request.slug());
		categoryRepository.findBySlug(slug)
				.filter(existing -> !existing.getId().equals(id))
				.ifPresent(existing -> {
					throw new IllegalArgumentException("Category slug already exists");
				});
		apply(category, request, slug);
		return toResponse(category);
	}

	public void delete(Long id) {
		Category category = getEntity(id);
		categoryRepository.delete(category);
	}

	private static void apply(Category category, CategoryRequest request, String slug) {
		category.setName(request.name().trim());
		category.setSlug(slug);
		category.setDescription(blankToNull(request.description()));
	}

	public static CategoryResponse toResponse(Category category) {
		return new CategoryResponse(
				category.getId(),
				category.getName(),
				category.getSlug(),
				category.getDescription(),
				category.getCreatedAt(),
				category.getUpdatedAt());
	}

	static String normalizeSlug(String value) {
		return value.toLowerCase()
				.trim()
				.replaceAll("[^a-z0-9]+", "-")
				.replaceAll("(^-|-$)", "");
	}

	static String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}
}
