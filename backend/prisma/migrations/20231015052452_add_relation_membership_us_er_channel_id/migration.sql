/*
  Warnings:

  - A unique constraint covering the columns `[userId,channelId]` on the table `ChannelMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChannelMembership_userId_channelId_key" ON "ChannelMembership"("userId", "channelId");
