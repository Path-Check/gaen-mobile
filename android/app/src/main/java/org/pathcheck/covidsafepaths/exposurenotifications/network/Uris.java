/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package org.pathcheck.covidsafepaths.exposurenotifications.network;

import android.net.Uri;
import android.util.Log;
import androidx.concurrent.futures.CallbackToFutureAdapter;
import com.android.volley.Response;
import com.android.volley.toolbox.StringRequest;
import com.google.common.base.Splitter;
import com.google.common.collect.ImmutableList;
import com.google.common.util.concurrent.FluentFuture;
import com.google.common.util.concurrent.ListenableFuture;
import java.util.ArrayList;
import java.util.List;
import org.pathcheck.covidsafepaths.BuildConfig;
import org.pathcheck.covidsafepaths.exposurenotifications.common.AppExecutors;
import org.pathcheck.covidsafepaths.exposurenotifications.storage.RealmSecureStorageBte;

/**
 * Encapsulates logic for resolving URIs for uploading and downloading Diagnosis Keys.
 */
public class Uris {
  private static final String TAG = "Uris";
  private static final Splitter WHITESPACE_SPLITTER =
      Splitter.onPattern("\\s+").trimResults().omitEmptyStrings();
  private static final String INDEX_FILE_PATH = BuildConfig.DOWNLOAD_PATH + "/index.txt";
  // TODO replace as needed per server implementation
  private static final int DEFAULT_BATCH_NUM = 1;
  // TODO handle batching or remove per server implementation
  private static final String DEFAULT_REGION_CODE = "regionCode";
  // TODO handle regions or remove  per server implementation
  private final Uri baseDownloadUri;

  public Uris() {
    baseDownloadUri = Uri.parse(BuildConfig.DOWNLOAD_BASE_URL);
  }

  // TODO Get list of download URIs per server spec
  // Download index file and then download from each URI in index file

  /**
   * Gets batches of URIs from which to download key files for the given country codes.
   */
  ListenableFuture<ImmutableList<KeyFileBatch>> getDownloadFileUris() {
    return FluentFuture.from(getKeyFileBatches())
        .transform(
            batches -> {
              List<KeyFileBatch> flattenedList = new ArrayList<>(batches);
              return ImmutableList.copyOf(flattenedList);
            },
            AppExecutors.getLightweightExecutor());
  }

  // Currently returns just one batch and just one region
  private ListenableFuture<ImmutableList<KeyFileBatch>> getKeyFileBatches() {
    return FluentFuture.from(getIndexFileContent())
        .transform(
            indexContent -> {
              Log.d(TAG, "Index content is " + indexContent);
              List<String> indexEntries = WHITESPACE_SPLITTER.splitToList(indexContent);
              Log.d(TAG, "Index file has " + indexEntries.size() + " lines.");
              List<Uri> uriList = new ArrayList<>();

              // Parse out each line of the index file and split them into batches as indicated by
              // the leading timestamp in the filename, e.g. "1589490000" for
              // "exposureKeyExport-US/1589490000-00002.zip"
              final String lastZipFileName =
                  RealmSecureStorageBte.INSTANCE.getLastProcessedKeyZipFileName();
              final int startIndex = getStartIndex(indexEntries, lastZipFileName);
              Log.d(TAG, "Last processed file name: " + lastZipFileName);
              Log.d(TAG, startIndex + " indexes were already processed. "
                  + (indexEntries.size() - startIndex) + " new files to process");

              for (int i = startIndex; i < indexEntries.size(); i++) {
                final String indexEntry = indexEntries.get(i);
                uriList.add(baseDownloadUri.buildUpon().appendEncodedPath(indexEntry).build());
              }

              ImmutableList.Builder<KeyFileBatch> builder = ImmutableList.builder();
              // Just one
              builder.add(KeyFileBatch.ofUris(DEFAULT_REGION_CODE, DEFAULT_BATCH_NUM, uriList));
              Log.d(TAG, String.format("Batches: %s", builder.build()));
              return builder.build();
            },
            AppExecutors.getBackgroundExecutor());
  }

  private int getStartIndex(List<String> allEntries, String lastIndexEntry) {
    int indexOfLastEntryInList = allEntries.indexOf(lastIndexEntry);
    return indexOfLastEntryInList == -1 ? 0 : indexOfLastEntryInList + 1;
  }

  // Downloads index file content as string (currently assuming .txt)
  private ListenableFuture<String> getIndexFileContent() {
    return CallbackToFutureAdapter.getFuture(
        completer -> {
          Response.Listener<String> responseListener = completer::set;

          Response.ErrorListener errorListener =
              err -> {
                Log.e(TAG, "Error getting keyfile index.");
                completer.setCancelled();
              };

          Uri indexUri = baseDownloadUri.buildUpon().appendEncodedPath(INDEX_FILE_PATH).build();
          Log.d(TAG, "Getting index file from " + indexUri);
          StringRequest request = new StringRequest(indexUri.toString(), responseListener, errorListener);
          request.setShouldCache(false);
          RequestQueueSingleton.get().add(request);
          return request;
        });
  }
}
