package com.autodeal.ShreeGaneshAutodeal.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class SupabasePropertiesTest {

	@Test
	@DisplayName("storageConfigured should return true when all properties are valid")
	void shouldReturnTrueWhenAllPropertiesValid() {
		SupabaseProperties properties = new SupabaseProperties();
		properties.setUrl("https://xyz.supabase.co");
		properties.setServiceRoleKey("valid-service-role-key");
		properties.getStorage().setBucket("vehicle-documents");

		assertThat(properties.storageConfigured()).isTrue();
	}

	@Test
	@DisplayName("storageConfigured should return false when url is null or blank")
	void shouldReturnFalseWhenUrlMissing() {
		SupabaseProperties properties = new SupabaseProperties();
		properties.setUrl("");
		properties.setServiceRoleKey("valid-service-role-key");

		assertThat(properties.storageConfigured()).isFalse();

		properties.setUrl(null);
		assertThat(properties.storageConfigured()).isFalse();
	}

	@Test
	@DisplayName("storageConfigured should return false when serviceRoleKey is null or blank")
	void shouldReturnFalseWhenKeyMissing() {
		SupabaseProperties properties = new SupabaseProperties();
		properties.setUrl("https://xyz.supabase.co");
		properties.setServiceRoleKey("  ");

		assertThat(properties.storageConfigured()).isFalse();

		properties.setServiceRoleKey(null);
		assertThat(properties.storageConfigured()).isFalse();
	}

	@Test
	@DisplayName("storageConfigured should return false when storage bucket is null or blank")
	void shouldReturnFalseWhenBucketMissing() {
		SupabaseProperties properties = new SupabaseProperties();
		properties.setUrl("https://xyz.supabase.co");
		properties.setServiceRoleKey("valid-service-role-key");
		properties.getStorage().setBucket("");

		assertThat(properties.storageConfigured()).isFalse();

		properties.setStorage(null);
		assertThat(properties.storageConfigured()).isFalse();
	}
}
