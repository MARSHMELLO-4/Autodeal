package com.autodeal.ShreeGaneshAutodeal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "supabase")
public class SupabaseProperties {

	private String url = "";
	private String serviceRoleKey = "";
	private Storage storage = new Storage();

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getServiceRoleKey() {
		return serviceRoleKey;
	}

	public void setServiceRoleKey(String serviceRoleKey) {
		this.serviceRoleKey = serviceRoleKey;
	}

	public Storage getStorage() {
		return storage;
	}

	public void setStorage(Storage storage) {
		this.storage = storage;
	}

	public boolean storageConfigured() {
		return url != null && !url.isBlank() && serviceRoleKey != null && !serviceRoleKey.isBlank()
				&& storage != null && storage.getBucket() != null && !storage.getBucket().isBlank();
	}

	public static class Storage {
		private String bucket = "vehicle-documents";

		public String getBucket() {
			return bucket;
		}

		public void setBucket(String bucket) {
			this.bucket = bucket;
		}
	}
}
