# [Wouaf IT](https://wouaf.it) [![Code Climate](https://codeclimate.com/github/WouafIT/Web_app/badges/gpa.svg)](https://codeclimate.com/github/WouafIT/Web_app)

This is the official version Wouaf IT web client.

How To Build
---------------------
1. First, install dependencies, by running:
`npm install`

2. Create a file ./config/config.json with all the required data (use config.default.json for more infos)
  - Contact Wouaf IT here to ask for API keys: https://wouafit.local/contact/ 
	Thank you explain the use you intend to do with this API.
  - Use the Google console to get an API Key for Google Map.
  - Use the Facebook console to create an app and get the App key.
  - Use Google analytics to get an analytics key.
	
3. For dev build, run:
`npm run-script dev`

Or for production build, run:
`npm run-script prod`

4. When you are building for development, a file ./vhost.conf will be created. 
You can include it from Apache to get all the vhost configuration done.
This file contain a comment with the commands to create the self signed certificates to uses.

Note: It's a shame, but for now, even if all the static files are built using node, npm and webpack, 
the index file uses PHP to generate dynamic data served to visitors (and obviously, search engines, aka Google).
This will be changed to uses a full node server instead but for now this is not in the top of the TODO list. 
Sorry for that.

Copyright and License
---------------------
Copyright 2016 by Sébastien Pauchet

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in compliance with 
the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed 
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for 
the specific language governing permissions and limitations under the License.