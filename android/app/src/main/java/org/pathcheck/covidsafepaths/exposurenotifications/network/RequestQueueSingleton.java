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

import com.android.volley.RequestQueue;
import com.android.volley.toolbox.BasicNetwork;
import com.android.volley.toolbox.HurlStack;
import com.android.volley.toolbox.NoCache;
import com.android.volley.toolbox.Volley;

/**
 * Holder for a singleton {@link Volley} {@link com.android.volley.RequestQueue}.
 */
public class RequestQueueSingleton {

  private static RequestQueue queue;

  private RequestQueueSingleton() {
  }

  public static RequestQueue get() {
    if (queue == null) {
      // In this reference design, we never want to return cached data; it complicates end to end
      // testing.
      queue = new RequestQueue(new NoCache(), new BasicNetwork(new HurlStack()));
      queue.start();
    }
    return queue;
  }
}
