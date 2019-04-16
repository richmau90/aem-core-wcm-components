/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2019 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* global hobs, jQuery */
;(function(h, $) { // eslint-disable-line no-extra-semi
    "use strict";

    var PN_MODEL_PATH                                   = "./modelPath";

    window.CQ.CoreComponentsIT.ContentFragmentList.v1   = window.CQ.CoreComponentsIT.ContentFragmentList.v1 || {};
    var c                                               = window.CQ.CoreComponentsIT.commons;
    var contentfragmentlist                             = window.CQ.CoreComponentsIT.ContentFragmentList.v1;
    var pageName                                        = "contentfragmentlist-page";
    var pageVar                                         = "contentfragmentlist_page";
    var pageDescription                                 = "contentfragmentlist page description";
    var modelPath                                       = "/conf/core-components/settings/dam/cfm/models/core-component-model";
    var parentPath                                      = "/content/dam/core-components/contentfragments-tests";
    var tagName                                         = "core-components-tests:component-type/basic";

    contentfragmentlist.tcExecuteBeforeTest = function(tcExecuteBeforeTest, contentfragmentlistRT, pageRT, clientlibs) {
        return new h.TestCase("Create sample content", {
            execBefore: tcExecuteBeforeTest
        })
            .execFct(function(opts, done) {
                c.createPage(c.template, c.rootPage, pageName, pageVar, done, pageRT, pageDescription);
            })

            // create a proxy component
            .execFct(function(opts, done) {
                c.createProxyComponent(contentfragmentlistRT, c.proxyPath, "proxyPath", done);
            })

            .execFct(function(opts, done) {
                c.addComponent(h.param("proxyPath")(opts), h.param(pageVar)(opts) + c.relParentCompPath, "cmpPath", done);
            })
            .navigateTo("/editor.html%" + pageVar + "%.html");
    };

    contentfragmentlist.tcExecuteAfterTest = function(tcExecuteAfterTest, policyPath, policyAssignmentPath) {
        return new h.TestCase("Clean up after test", {
            execAfter: tcExecuteAfterTest
        })
            // delete the test proxies we created
            .execFct(function(opts, done) {
                c.deleteProxyComponent(h.param("proxyPath")(opts), done);
            })

            .execFct(function(opts, done) {
                c.deletePage(h.param(pageVar)(opts), done);
            });
    };

    /**
     * Set the parent path
     */
    contentfragmentlist.tcSetParentPath = function(tcExecuteBeforeTest, tcExecuteAfterTest, selectors) {
        return new h.TestCase("Set the parent path", {
            execBefore: tcExecuteBeforeTest,
            execAfter: tcExecuteAfterTest
        })
        // open the edit dialog
            .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
            // set the model
            .execTestCase(c.tcUseDialogSelect(PN_MODEL_PATH, modelPath))
            // set the parent path
            .execTestCase(c.tcSelectInAutocomplete(selectors.editDialog.parentPath, parentPath))
            // save the edit dialog
            .execTestCase(c.tcSaveConfigureDialog)
            .wait(200)
            // switch to the content frame
            .config.changeContext(c.getContentFrame)
            .asserts.isTrue(function() {
                var $contentfragmentlist = h.find(selectors.contentfragmentlist.self);
                var $contentfragments = h.find(selectors.contentfragment.self);
                var $contentfragmenttitles = h.find(selectors.contentfragment.title);
                var $contentfragmentelements = h.find(selectors.contentfragment.elements.element.title);
                return $contentfragmentlist.size() === 1 &&
                    $contentfragments.size() === 3 &&
                    $contentfragmentelements.size() === 12 &&
                    $contentfragmenttitles[0].innerHTML === "Carousel Fragment" &&
                    $contentfragmenttitles[1].innerHTML === "Image Fragment" &&
                    $contentfragmenttitles[2].innerHTML === "Text Fragment";
            });
    };

    /**
     * Set the tag names
     */
    contentfragmentlist.tcSetTagNames = function(tcExecuteBeforeTest, tcExecuteAfterTest, selectors) {
        return new h.TestCase("Set the tag names", {
            execBefore: tcExecuteBeforeTest,
            execAfter: tcExecuteAfterTest
        })
        // open the edit dialog
            .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
            // set the model
            .execTestCase(c.tcUseDialogSelect(PN_MODEL_PATH, modelPath))
            // set the parent path
            .execTestCase(c.tcSelectInAutocomplete(selectors.editDialog.parentPath, parentPath))
            // set the tag
            .execTestCase(c.tcSelectInTags(selectors.editDialog.tagNames, tagName))
            // save the edit dialog
            .execTestCase(c.tcSaveConfigureDialog)
            .wait(200)
            // switch to the content frame
            .config.changeContext(c.getContentFrame)
            .asserts.isTrue(function() {
                var $contentfragmentlist = h.find(selectors.contentfragmentlist.self);
                var $contentfragments = h.find(selectors.contentfragment.self);
                var $contentfragmenttitles = h.find(selectors.contentfragment.title);
                var $contentfragmentelements = h.find(selectors.contentfragment.elements.element.title);
                return $contentfragmentlist.size() === 1 &&
                    $contentfragments.size() === 2 &&
                    $contentfragmentelements.size() === 8 &&
                    $contentfragmenttitles[0].innerHTML === "Image Fragment" &&
                    $contentfragmenttitles[1].innerHTML === "Text Fragment";
            });
    };

    /**
     * Set the element names
     */
    contentfragmentlist.tcSetElementNames = function(tcExecuteBeforeTest, tcExecuteAfterTest, selectors) {
        return new h.TestCase("Set the element names", {
            execBefore: tcExecuteBeforeTest,
            execAfter: tcExecuteAfterTest
        })
        // open the edit dialog
            .execTestCase(c.tcOpenConfigureDialog("cmpPath"))
            // set the model
            .execTestCase(c.tcUseDialogSelect(PN_MODEL_PATH, modelPath))
            // set the parent path
            .execTestCase(c.tcSelectInAutocomplete(selectors.editDialog.parentPath, parentPath))

            // switch to the elements tab
            .click(selectors.editDialog.tabs.elements)
            // add a first element
            .click(selectors.editDialog.elements.addButton)
            .wait(200)
            // select the title element
            .execTestCase(c.tcUseDialogSelect("./elementNames", "component-title"))
            // add a second element
            .click(selectors.editDialog.elements.addButton)
            .wait(200)
            // expand the dropdown
            .click(selectors.editDialog.elements.last + " " + selectors.editDialog.elements.select.button)
            // select the type element
            .click(selectors.editDialog.elements.last + " " + selectors.editDialog.elements.select.item + "[value='component-type']")

            // save the edit dialog
            .execTestCase(c.tcSaveConfigureDialog)
            .wait(200)
            // switch to the content frame
            .config.changeContext(c.getContentFrame)
            .asserts.isTrue(function() {
                var $contentfragmentlist = h.find(selectors.contentfragmentlist.self);
                var $contentfragments = h.find(selectors.contentfragment.self);
                var $contentfragmenttitles = h.find(selectors.contentfragment.title);
                var $contentfragmentelements = h.find(selectors.contentfragment.elements.element.title);
                return $contentfragmentlist.size() === 1 &&
                    $contentfragments.size() === 3 &&
                    $contentfragmentelements.size() === 6 &&
                    $contentfragmenttitles[0].innerHTML === "Carousel Fragment" &&
                    $contentfragmenttitles[1].innerHTML === "Image Fragment" &&
                    $contentfragmenttitles[2].innerHTML === "Text Fragment";
            });
    };

}(hobs, jQuery));