sap.ui.define(
    ["sap/ui/core/mvc/Controller"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("chatui.controller.Chat", {
            onInit: function () {
                this.showFeedInput(false);
            },

            showFeedInput: function (bVisible) {
                const oFeedInput = this.byId("feedInput");
                oFeedInput.setVisible(bVisible);
            },

            onPressGoToMaster: function (oEvent) {
                const oContext = oEvent.getSource().getBindingContext();
                const oPage = this.byId("chats");
                oPage.setBindingContext(oContext);
                this.showFeedInput(true);
            },

            onPost: function (oEvent) {
                this.byId('chats').setBusy(true);

                const nSessionId = oEvent.getSource().getBindingContext().getObject().ID;

                const oModel = this.getView().getModel();

                oModel.callFunction("/sendMessage", {
                    method: "GET",
                    urlParameters: {
                        Message: oEvent.getParameters().value,
                        sessionId: nSessionId,
                    },
                    success: function (oData, response) {
                        if (oData.sendMessage === "OK") {
                            this.getView().getModel().refresh();
                            this.byId('chats').setBusy(false);
                        };
                    }.bind(this),
                    error: (e) => {
                        console.error(e);
                    },
                });
            },
        });
    }
);
