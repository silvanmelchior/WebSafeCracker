import os
from storages.backends.azure_storage import AzureStorage


class AzureMediaStorage(AzureStorage):
    account_name = os.environ['STORAGE_ACCOUNT_NAME']
    account_key = os.environ['STORAGE_ACCOUNT_KEY']
    azure_container = 'media'
    expiration_secs = None
