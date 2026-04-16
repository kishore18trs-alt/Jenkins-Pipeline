pipeline {
agent any

```
environment {
    NODE_ENV = 'production'
}

stages {

    stage('Checkout') {
        steps {
            git 'https://github.com/kishore18trs-alt/Jenkins-Pipeline.git'
        }
    }

    stage('Build') {
        steps {
            sh 'npm install'
        }
    }

    stage('Test') {
        steps {
            sh 'npm test || echo "No tests yet"'
        }
    }

    stage('Deploy') {
        steps {
            echo "Deploying app..."
            sh 'pm2 restart app || pm2 start app.js --name app'
        }
    }
}

post {
    success {
        echo 'Build Success!'
        mail to: 'kishore18.trs@gmail.com',
             subject: 'Jenkins Success',
             body: 'Pipeline passed!'
    }
    failure {
        echo 'Build Failed!'
        mail to: 'kishore18.trs@gmail.com',
             subject: 'Jenkins Failed',
             body: 'Pipeline failed!'
    }
}
```

}
