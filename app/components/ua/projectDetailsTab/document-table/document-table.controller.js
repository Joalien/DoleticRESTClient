(function () {
    'use strict';

    angular
        .module('doleticApp')
        .controller('uaDocumentTableController', uaDocumentTableController);

    uaDocumentTableController.$inject = ['$scope', '$state', 'ProjectService', 'UAService', 'ProjectDocumentTemplateService',
        'ProjectDocumentService', 'ProjectManagerService', 'ProjectContactService', 'ConsultantService',
        'MessageBoxService', 'ConsultantDocumentTemplateService', 'ConsultantDocumentService',
        'DeliveryDocumentTemplateService', 'DeliveryDocumentService', 'DeliveryService'];

    function uaDocumentTableController($scope, $state, ProjectService, UAService, ProjectDocumentTemplateService,
                                       ProjectDocumentService, ProjectManagerService, ProjectContactService, ConsultantService,
                                       MessageBoxService, ConsultantDocumentTemplateService, ConsultantDocumentService,
                                       DeliveryDocumentTemplateService, DeliveryDocumentService, DeliveryService) {
        $scope.uaService = UAService;

        $scope.projectService = ProjectService;
        $scope.projectDocumentService = ProjectDocumentService;
        $scope.projectDocumentTemplateService = ProjectDocumentTemplateService;

        $scope.projectContactService = ProjectContactService;
        $scope.projectManagerService = ProjectManagerService;
        $scope.consultantService = ConsultantService;

        $scope.consultantDocumentTemplateService = ConsultantDocumentTemplateService;
        $scope.consultantDocumentService = ConsultantDocumentService;

        $scope.deliveryService = DeliveryService;
        $scope.deliveryDocumentTemplateService = DeliveryDocumentTemplateService;
        $scope.deliveryDocumentService = DeliveryDocumentService;

        $scope.publish = {
            project: $state.params.id,
            manager: ProjectManagerService.currentProjectManagers && angular.equals(ProjectManagerService.currentProjectManagers, {}) ?
                null : ProjectManagerService.currentProjectManagers[Object.keys(ProjectManagerService.currentProjectManagers)[0]].id,
            contact: ProjectContactService.currentProjectContacts && angular.equals(ProjectContactService.currentProjectContacts, {}) ?
                null : ProjectContactService.currentProjectContacts[Object.keys(ProjectContactService.currentProjectContacts)[0]].id,
            consultant: ConsultantService.currentProjectConsultants && angular.equals(ConsultantService.currentProjectConsultants, {}) ?
                null : ConsultantService.currentProjectConsultants[Object.keys(ConsultantService.currentProjectConsultants)[0]].id,
            delivery: DeliveryService.currentProjectDeliveries && angular.equals(DeliveryService.currentProjectDeliveries, {}) ?
                null : DeliveryService.currentProjectDeliveries[Object.keys(DeliveryService.currentProjectDeliveries)[0]].id
        };

        $scope.resetForm = function () {
            $scope.publish = {project: $state.params.id};
        };

        $scope.downloadDocument = function (id, template) {
            ProjectDocumentService.downloadProjectDocument(id, template.label, ProjectService.selectedProject.number);
        };

        $scope.downloadConsultantDocument = function (id, template) {
            ConsultantDocumentService.downloadConsultantDocument(id, template.label, ProjectService.selectedProject.number, ConsultantService.currentProjectConsultants[$scope.publish.consultant].number);
        };

        $scope.downloadDeliveryDocument = function (id, template) {
            DeliveryDocumentService.downloadDeliveryDocument(id, template.label, ProjectService.selectedProject.number, DeliveryService.currentProjectDeliveries[$scope.publish.delivery].number);
        };

        $scope.replaceDocument = function (e, document) {
            var documentData = angular.copy(document);
            if (documentData.template) documentData.template = documentData.template.id;
            documentData.project = $state.params.id;
            documentData.file = e.files[0];

            ProjectDocumentService.putProjectDocument(documentData).success(function (data) {
                MessageBoxService.showSuccess(
                    "Upload réussi !",
                    "Le nouveau fichier a été uploadé !"
                );
            }).error(function (data) {
                MessageBoxService.showError(
                    "Echec de l'upload !",
                    "Impossible d'uploader le document. Vérifiez qu'il est bien au format PDF."
                );
            });
        };

        $scope.replaceConsultantDocument = function (e, document) {
            var documentData = angular.copy(document);
            if (documentData.template) documentData.template = documentData.template.id;
            documentData.consultant = $scope.publish.consultant;
            documentData.file = e.files[0];

            ConsultantDocumentService.putConsultantDocument(documentData, $scope.publish.consultant).success(function (data) {
                MessageBoxService.showSuccess(
                    "Upload réussi !",
                    "Le nouveau fichier a été uploadé !"
                );
            }).error(function (data) {
                MessageBoxService.showError(
                    "Echec de l'upload !",
                    "Impossible d'uploader le document. Vérifiez qu'il est bien au format PDF."
                );
            });
        };

        $scope.replaceDeliveryDocument = function (e, document) {
            var documentData = angular.copy(document);
            if (documentData.template) documentData.template = documentData.template.id;
            documentData.delivery = $scope.publish.delivery;
            documentData.file = e.files[0];

            DeliveryDocumentService.putDeliveryDocument(documentData, $scope.publish.delivery).success(function (data) {
                MessageBoxService.showSuccess(
                    "Upload réussi !",
                    "Le nouveau fichier a été uploadé !"
                );
            }).error(function (data) {
                MessageBoxService.showError(
                    "Echec de l'upload !",
                    "Impossible d'uploader le document. Vérifiez qu'il est bien au format PDF."
                );
            });
        };

        $scope.triggerUpload = function (event) {
            angular.element(event.target).siblings('input').trigger('click');
        };

        $scope.uploadDocument = function (e, template) {
            ProjectDocumentService.postProjectDocument({
                file: e.files[0],
                project: $state.params.id,
                template: template.id,
                valid: false
            }).success(function (data) {
                MessageBoxService.showSuccess(
                    "Upload réussi !",
                    "Le fichier a été uploadé !"
                );
            }).error(function (data) {
                MessageBoxService.showError(
                    "Echec de l'upload !",
                    "Impossible d'uploader le document. Vérifiez qu'il est bien au format PDF."
                );
            });
        };

        $scope.uploadConsultantDocument = function (e, template) {
            ConsultantDocumentService.postConsultantDocument({
                file: e.files[0],
                consultant: $scope.publish.consultant,
                template: template.id,
                valid: false
            }, $scope.publish.consultant).success(function (data) {
                MessageBoxService.showSuccess(
                    "Upload réussi !",
                    "Le fichier a été uploadé !"
                );
            }).error(function (data) {
                MessageBoxService.showError(
                    "Echec de l'upload !",
                    "Impossible d'uploader le document. Vérifiez qu'il est bien au format PDF."
                );
            });
        };

        $scope.uploadDeliveryDocument = function (e, template) {
            DeliveryDocumentService.postDeliveryDocument({
                file: e.files[0],
                delivery: $scope.publish.delivery,
                template: template.id,
                valid: false
            }, $scope.publish.delivery).success(function (data) {
                MessageBoxService.showSuccess(
                    "Upload réussi !",
                    "Le fichier a été uploadé !"
                );
            }).error(function (data) {
                MessageBoxService.showError(
                    "Echec de l'upload !",
                    "Impossible d'uploader le document. Vérifiez qu'il est bien au format PDF."
                );
            });
        };

        $scope.publishDocument = function (template) {
            $scope.publish.template = template.id;
            if ($scope.publishForm.$valid) {
                UAService.publishProjectDocument($scope.publish, template.label, ProjectService.selectedProject.number).success(function (data) {
                    MessageBoxService.showSuccess(
                        "Publipostage réussi !",
                        "Le téléchargement devrait démarrer."
                    );
                }).error(function (data) {
                    MessageBoxService.showError(
                        "Echec du publipostage !",
                        "Impossible de générer le document."
                    );
                });
            } else {
                MessageBoxService.showError(
                    "Données manquantes !",
                    "Impossible de publiposter un document si le chargé d'affaires et le contact ne sont pas selectionnés."
                );
            }
        };

        $scope.publishConsultantDocument = function (template) {
            $scope.publish.template = template.id;
            if ($scope.publishForm.$valid && $scope.publish.consultant) {
                UAService.publishConsultantDocument($scope.publish, template.label, ProjectService.selectedProject.number, ConsultantService.currentProjectConsultants[$scope.publish.consultant].number)
                    .success(function (data) {
                    MessageBoxService.showSuccess(
                        "Publipostage réussi !",
                        "Le téléchargement devrait démarrer."
                    );
                }).error(function (data) {
                    MessageBoxService.showError(
                        "Echec du publipostage !",
                        "Impossible de générer le document."
                    );
                });
            } else {
                MessageBoxService.showError(
                    "Données manquantes !",
                    "Impossible de publiposter un document si le chargé d'affaires et le contact ne sont pas selectionnés."
                );
            }
        };

        $scope.publishDeliveryDocument = function (template) {
            $scope.publish.template = template.id;
            if ($scope.publishForm.$valid && $scope.publish.delivery) {
                UAService.publishDeliveryDocument($scope.publish, template.label, ProjectService.selectedProject.number, DeliveryService.currentProjectDeliveries[$scope.publish.delivery].number)
                    .success(function (data) {
                        MessageBoxService.showSuccess(
                            "Publipostage réussi !",
                            "Le téléchargement devrait démarrer."
                        );
                    }).error(function (data) {
                    MessageBoxService.showError(
                        "Echec du publipostage !",
                        "Impossible de générer le document."
                    );
                });
            } else {
                MessageBoxService.showError(
                    "Données manquantes !",
                    "Impossible de publiposter un document si le chargé d'affaires et le contact ne sont pas selectionnés."
                );
            }
        };

        ProjectDocumentTemplateService.getAllProjectDocumentTemplates(true);
        ConsultantDocumentTemplateService.getAllConsultantDocumentTemplates(true);
        DeliveryDocumentTemplateService.getAllDeliveryDocumentTemplates(true);
    }
})();
