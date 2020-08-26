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

import android.content.Context;
import com.google.common.collect.ImmutableList;
import com.google.common.util.concurrent.ListenableFuture;

/**
 * A facade to network operations to download all known Diagnosis Keys.
 *
 * <p>The download is a file fetch.
 *
 * <p>In the future we could use this facade to switch between using a live test server and internal
 * faked implementations.
 */
public class DiagnosisKeys {

  private final DiagnosisKeyDownloader diagnosisKeyDownloader;

  public DiagnosisKeys(Context context) {
    diagnosisKeyDownloader = new DiagnosisKeyDownloader(context.getApplicationContext());
  }

  public ListenableFuture<ImmutableList<KeyFileBatch>> download() {
    return diagnosisKeyDownloader.download();
  }
}
