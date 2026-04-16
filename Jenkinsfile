pipeline {
agent any

```
stages {

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
            sh 'node index.js &'
        }
    }
}

post {
    success {
        echo 'Build Success!'
    }
    failure {
        echo 'Build Failed!'
    }
}
```

}
