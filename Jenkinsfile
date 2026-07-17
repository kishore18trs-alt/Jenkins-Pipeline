pipeline {
    agent any

    options {
        skipDefaultCheckout()
    }

    tools {
        nodejs 'NodeJS-20'
    }

    // ── PARAMETERS: inputs you choose on "Build with Parameters" ──
    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['dev', 'staging', 'prod'], description: 'Which environment to deploy to')
        booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run the Test stage?')
    }

    // ── CREDENTIALS: pull the secret by ID and inject it MASKED as $API_KEY ──
    environment {
        API_KEY = credentials('demo-api-key')
    }

    stages {

        stage('Checkout') {
            steps {
                // `checkout scm` = check out whatever branch/commit triggered THIS build.
                // Works for both the single-branch job (builds main) and the
                // multibranch pipeline (builds feature branches / PRs correctly).
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        // ── PARALLEL: Lint and Test run at the SAME time ──
        stage('Quality Checks') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Test') {
                    // ── WHEN: only run tests if the RUN_TESTS checkbox is ticked ──
                    when {
                        expression { return params.RUN_TESTS }
                    }
                    steps {
                        sh 'npm test'
                    }
                    // ── REPORTS: publish test results + coverage to Jenkins ──
                    post {
                        always {
                            // JUnit plugin: shows pass/fail counts + a trend graph over builds
                            junit testResults: 'junit.xml', allowEmptyResults: true
                            // Coverage plugin: shows % of code exercised by tests
                            recordCoverage(tools: [[parser: 'COBERTURA', pattern: 'coverage/cobertura-coverage.xml']])
                        }
                    }
                }
            }
        }

        stage('Use Secret') {
            steps {
                // $API_KEY comes from the credentials store — Jenkins masks it as **** in the log
                sh 'echo "Deploying with API key: $API_KEY (see how it is masked?)"'
            }
        }

        // ── WHEN: only deploy for staging/prod — skip on dev ──
        stage('Deploy') {
            when {
                expression { return params.DEPLOY_ENV != 'dev' }
            }
            steps {
                sh '''
                    echo "Deploying to environment: $DEPLOY_ENV"
                    echo "Stopping old container..."
                    docker stop my-node-app || true
                    docker rm my-node-app || true

                    echo "Building image..."
                    docker build -t my-node-app .

                    echo "Running container..."
                    docker run -d -p 3000:3000 --name my-node-app my-node-app

                    echo "Waiting for app..."
                    sleep 5

                    echo "Health check..."
                    curl -f http://host.docker.internal:3000/health
                '''
            }
        }

        stage('Notify') {
            steps {
                echo "Pipeline completed for '${params.DEPLOY_ENV}' 🎉"
            }
        }
    }

    post {
        success {
            echo "SUCCESS: ${env.JOB_NAME} — build passed ✅ ${env.BUILD_URL}"

            // ── THE GATE (CI → CD) ──
            // This block runs ONLY if every stage above passed (incl. Test).
            // So if a test fails, the build never reaches here → Coolify is NEVER triggered.
            // That is what makes tests *gate* the deploy.
            withCredentials([string(credentialsId: 'coolify-token', variable: 'COOLIFY_TOKEN')]) {
                sh '''
                    echo "All checks passed — asking Coolify to deploy... 🚀"
                    curl --fail -X GET \
                      "http://host.docker.internal:8000/api/v1/deploy?uuid=rd2tzzddrlzcq1ndgpdo4vgl&force=false" \
                      -H "Authorization: Bearer $COOLIFY_TOKEN"
                '''
            }

            mail to: 'kishore18.trs@gmail.com',
                 subject: "✅ SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: """Good news — the build passed! 🎉

Job:   ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}
Link:  ${env.BUILD_URL}"""
        }
        failure {
            echo "FAILED: ${env.JOB_NAME} — build failed ❌ ${env.BUILD_URL}"
            mail to: 'kishore18.trs@gmail.com',
                 subject: "❌ FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: """The build failed. 😟

Job:   ${env.JOB_NAME}
Build: #${env.BUILD_NUMBER}
Check the logs: ${env.BUILD_URL}"""
        }
    }
}
