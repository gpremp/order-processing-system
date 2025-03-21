const {
    SendMessageCommand,
    ReceiveMessageCommand,
    DeleteMessageCommand,
    ListQueuesCommand,
  } = require("@aws-sdk/client-sqs");
  const sqsClient = require("../config/aws-sqs");
  const logger = require("../utils/logger"); // Import logger utility
  
  // SQS Queue URL
  const QUEUE_URL = process.env.AWS_QUEUE_URL;

/**
 * Send a message to the SQS queue with retry logic.
 * @param {Object} messageBody - The message content (JSON object).
 * @param {number} maxRetries - Maximum number of retries (default: 3).
 * @returns {Promise<Object>} - The SQS response.
 * @throws {Error} If the message fails to send after max retries.
 */
const sendSQSMessage = async (messageBody, maxRetries = 3) => {
  const params = {
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify(messageBody),
  };

  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const data = await sqsClient.send(new SendMessageCommand(params));
      logger.info(`✅ Message sent successfully. Message ID: ${data.MessageId}`); // Log success
      return data;
    } catch (error) {
      retryCount++;
      logger.error(`❌ Attempt ${retryCount}: Error sending message to SQS: ${error.message}`); // Log error

      if (retryCount >= maxRetries) {
        logger.error(`❌ Max retries (${maxRetries}) reached. Failed to send message to SQS`); // Log failure
        throw new Error("Failed to send message to SQS after max retries");
      }

      // Wait for a short delay before retrying (e.g., 1 second)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
  
  /**
   * Receive messages from the SQS queue.
   * @param {number} [maxMessages=5] - Maximum number of messages to retrieve (1-10).
   * @param {number} [waitTimeSeconds=1] - Wait time for long polling (in seconds).
   * @returns {Promise<Array>} - The list of received messages.
   * @throws {Error} If the messages fail to be received.
   */
  const receiveSQSMessages = async (maxMessages = 5, waitTimeSeconds = 1) => {
    const params = {
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: maxMessages,
      WaitTimeSeconds: waitTimeSeconds,
    };
  
    try {
      const data = await sqsClient.send(new ReceiveMessageCommand(params));
      if (data.Messages && data.Messages.length > 0) {
        logger.info(`📩 Received ${data.Messages.length} messages from SQS`); // Log success
        return data;
      } else {
        logger.info("📭 No messages available in the SQS queue"); // Log no messages
        return [];
      }
    } catch (error) {
      logger.error(`❌ Error receiving messages from SQS: ${error.message}`, error); // Log error
      throw new Error("Failed to receive messages from SQS");
    }
  };
  
  /**
   * Delete a message from the SQS queue.
   * @param {string} receiptHandle - The receipt handle of the message.
   * @returns {Promise<void>}
   * @throws {Error} If the message fails to be deleted.
   */
  const deleteSQSMessage = async (receiptHandle) => {
    const params = {
      QueueUrl: QUEUE_URL,
      ReceiptHandle: receiptHandle,
    };
  
    try {
      await sqsClient.send(new DeleteMessageCommand(params));
      logger.info("🗑️ Message deleted successfully from SQS"); // Log success
    } catch (error) {
      logger.error(`❌ Error deleting message from SQS: ${error.message}`, error); // Log error
      throw new Error("Failed to delete message from SQS");
    }
  };
  
  /**
   * List all SQS queues.
   * @returns {Promise<Array>} - The list of SQS queue URLs.
   * @throws {Error} If the queues fail to be listed.
   */
  const listSQSQueues = async () => {
    try {
      const data = await sqsClient.send(new ListQueuesCommand({}));
      logger.info("📃 Successfully listed SQS queues"); // Log success
      return data.QueueUrls || [];
    } catch (error) {
      logger.error(`❌ Error listing SQS queues: ${error.message}`, error); // Log error
      throw new Error("Failed to list SQS queues");
    }
  };
  
  module.exports = {
    sendSQSMessage,
    receiveSQSMessages,
    deleteSQSMessage,
    listSQSQueues,
  };