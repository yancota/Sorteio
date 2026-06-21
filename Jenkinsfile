pipeline {
    agent any

    tools {
        nodejs 'NodeJS-18'
    }

    environment {
        NODE_ENV = 'test'
        PORT = '8080'
        DB_HOST = 'localhost'
        DB_PORT = '5432'
        DB_NAME = 'db_bolao_test'
        DB_USER = 'postgres'
        DB_PASSWORD = 'password'
        JWT_SECRET = 'GaloDoidoMatador2025!VenhaSula#Test'
        ADMIN_USERNAME = 'cota@admin'
        ADMIN_PASSWORD = '$2a$10$T1Ua52p/gN114t/R1jO6k.Mv9C328h5XQ1G4m9s1719s/Ue14VpY2' // Hash para CotaBolao2025#
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('back') {
                    script {
                        if (isUnix()) {
                            sh 'npm install'
                        } else {
                            bat 'npm install'
                        }
                    }
                }
            }
        }

        stage('Unit Tests') {
            steps {
                dir('back') {
                    script {
                        if (isUnix()) {
                            sh 'npm run test:unit'
                        } else {
                            bat 'npm run test:unit'
                        }
                    }
                }
            }
        }

        stage('Integration Tests') {
            steps {
                dir('back') {
                    script {
                        if (isUnix()) {
                            sh 'npm run test:integration'
                        } else {
                            bat 'npm run test:integration'
                        }
                    }
                }
            }
        }

        stage('Acceptance Tests') {
            steps {
                dir('back') {
                    script {
                        if (isUnix()) {
                            sh 'npm run test:acceptance'
                        } else {
                            bat 'npm run test:acceptance'
                        }
                    }
                }
            }
        }

        stage('Deploy to Render') {
            when {
                branch 'main'
            }
            steps {
                // Utiliza a credencial 'RENDER_DEPLOY_HOOK' cadastrada no Jenkins
                withCredentials([string(credentialsId: 'RENDER_DEPLOY_HOOK', variable: 'RENDER_DEPLOY_HOOK_URL')]) {
                    script {
                        if (isUnix()) {
                            sh 'curl -X POST "${RENDER_DEPLOY_HOOK_URL}"'
                        } else {
                            bat 'curl -X POST "%RENDER_DEPLOY_HOOK_URL%"'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizada!'
        }
        success {
            echo 'Pipeline executada com sucesso!'
        }
        failure {
            echo 'Pipeline falhou. Verifique os logs de teste.'
        }
    }
}
