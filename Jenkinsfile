pipeline {
    agent any

    options {
        skipDefaultCheckout()
    }

    tools {
        nodejs 'NodeJS-20'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/kishore18trs-alt/Jenkins-Pipeline.git'
            }
        }

        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Deploy') {
    steps {
        sh '''
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
            curl -f http://localhost:3000/health
        '''
    }
}

        stage('Notify') {
            steps {
                echo "Pipeline completed successfully 🎉"
            }
        }
    }

    post {
        success {
            mail to: 'kishore18.trs@gmail.com',
                 subject: "SUCCESS: ${env.JOB_NAME}",
                 body: "Build passed ✅ ${env.BUILD_URL}"
        }
        failure {
            mail to: 'kishore18.trs@gmail.com',
                 subject: "FAILED: ${env.JOB_NAME}",
                 body: "Build failed ❌ ${env.BUILD_URL}"
        }
    }
}